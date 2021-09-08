/* eslint-disable */
const { QueryTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Devices = require('../models/Devices');
const credentials = require('../../config/credentials');
const constants = require('../../config/constants');
const Utils = require('../services/util.service');
const fs = require("fs");

const DatabaseController = () => {
  const utils = Utils();

  const getAll = async (req, res) => {
    try {
      const users = await Devices.findAll();

      return res.status(200).json({ users });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };

  const getDbPars = async () => {
    const result = await sequelize.query('SELECT database() as db, user() as usr', { type: QueryTypes.SELECT });
    const databaseParameters = result[0];
    databaseParameters['usr'] = databaseParameters.usr.split('@');

    return databaseParameters;
  }

  const getAction = async (databaseParameters, mode, { nodevices, noevents, nousers }, t) => {
    const { username, password } = credentials;

    if (mode) {
      switch(mode) {
        case 'prepare':
          const $no_events = nodevices ? 'on' : noevents; // make sure that events are not backed up if the devices are not
          // select tables to ignore
          let $ignore_tables = '';
          if ($no_events || nodevices || nousers) {
            // we are not backing up events or any related data
            if ($no_events) {
              $ignore_tables += ` --ignore-table=${databaseParameters['db']}.EventsCam`;
              $ignore_tables += ` --ignore-table=${databaseParameters['db']}.EventComments`;
              $ignore_tables += ` --ignore-table=${databaseParameters['db']}.EventTags`;
              $ignore_tables += ` --ignore-table=${databaseParameters['db']}.Media`;
              $ignore_tables += ` --ignore-table=${databaseParameters['db']}.EventsSystem`;
            }
            // we are not backing up users or related data
            if (nousers) {
              $ignore_tables += ` --ignore-table=${databaseParameters['db']}.Users`;
              $ignore_tables += ` --ignore-table=${databaseParameters['db']}.ActiveUsers`;
            }
            // we are not backing up devices or related data
            if (nodevices) {
              $ignore_tables += ` --ignore-table=${databaseParameters['db']}.Devices`;
              $ignore_tables += ` --ignore-table=${databaseParameters['db']}.PTZPresets`;
              $ignore_tables += ` --ignore-table=${databaseParameters['db']}.AvailableSources`;
            }

          }
          // TODO - Add web UI form for user to select host, right now default to localhost.
          // const pwd = escapeshellarg($_POST[pwd]);
          await utils.execPromise(`/Applications/MAMP/Library/bin/mysqldump --single-transaction -u ${username} --password=${password} ${databaseParameters['db']} ${$ignore_tables}> /tmp/bcbackup.sql`);
          const stats = fs.statSync("/tmp/bcbackup.sql");
          if (stats.size==0){
            return{
              success: false,
              msg: t('BACKUP_FAILED'),
            }
          } else {
            const current_time = parseInt((new Date().getTime()/1000))
            let backupInfo = current_time+'|'+(noevents ? '0' : '1')+'|'+(nodevices ? '0' : '1')+'|'+(nousers ? '0' : '1');
            await fs.appendFileSync( '/tmp/bcbackupinfo', backupInfo)
            await utils.execPromise(`tar --directory="/tmp" -czvf ${constants.VAR_MYSQLDUMP_TMP_LOCATION} bcbackup.sql bcbackupinfo`);
            // clean up
            await fs.unlinkSync('/tmp/bcbackupinfo');
            await fs.unlinkSync('/tmp/bcbackup.sql');
            return{
              success: true,
              msg: t('BACKUP_B_SUCCESS'),
            }
          }
          break;
      }
    }
  }
  const baseName = (str) => {
    return new String(str).substring(str.lastIndexOf('/') + 1);
  }

  const getData = async (req, res) => {
    try{
      const databaseParameters = await getDbPars();
      const data = await getAction(databaseParameters, req.query.mode, req.body, req.t);
      if(data.success){
        return res.status(200).json({ data });
      } else {
        return res.status(500).json({ ...data });
      }
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  }

  const downloadBackup = async (req, res) => {
    try{
      const MyDate = new Date();
      const format = MyDate.getFullYear()+ ('0' + (MyDate.getMonth()+1)).slice(-2)+('0' + MyDate.getDate()).slice(-2)
      const fileName = `${format}_${baseName(constants.VAR_MYSQLDUMP_TMP_LOCATION)}`;

      res.download(constants.VAR_MYSQLDUMP_TMP_LOCATION, fileName);

    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  }

  const restoreBackup = async (req, res) => {
    try{
      const { file } = req;
      const bcbackupinfo = '/tmp/bcbackupinfo';
      await utils.execPromise(`tar zxvf ${file.path} -C /tmp/`);
      const fileExists = fs.existsSync(bcbackupinfo);
      if (!fileExists){ // no info file was in archive
        return res.status(500).json({ msg: req.t('BACKUP_R_NOINFO') });
      } else {
        let backupInfo = await fs.readFileSync(bcbackupinfo, "utf8");
        backupInfo = backupInfo.split('|');
        backupInfo[0] = new Date(backupInfo[0] * 1000);
        backupInfo[1] = (backupInfo[1]) ? req.t('U_INCLUDED') : req.t('U_NOTINCLUDED');
        backupInfo[2] = (backupInfo[2]) ? req.t('U_INCLUDED') : req.t('U_NOTINCLUDED');
        backupInfo[3] = (backupInfo[3]) ? req.t('U_INCLUDED') : req.t('U_NOTINCLUDED');
        // clean up infofile
        await fs.unlinkSync('/tmp/bcbackupinfo');
        return res.status(500).json({
          msg: req.t('BACKUP_R_INFO', {
            DATE: backupInfo[0],
            E: backupInfo[1],
            D: backupInfo[2],
            U: backupInfo[3],
          })
        });
      }
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  }
  const confirmRestore = async (req, res) => {
    try{
      const { username, password, database } = credentials;
      const $response = await utils.execPromise(`mysql -u ${username} --password=${password} ${database} < /tmp/bcbackup.sql 2>&1 1> /dev/null`);
      if (!($response) && $response.indexOf('ERROR') >= -1){
        return res.status(500).json({ msg: `${req.t('BACKUP_R_FAILED')}${$response}` });
      } else {
        return res.status(200).json({ msg: req.t('BACKUP_R_SUCCESS')});
      }
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  }


  return {
    getAll,
    getData,
    downloadBackup,
    restoreBackup,
    confirmRestore
  };
};

module.exports = DatabaseController;
