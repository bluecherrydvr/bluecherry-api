/* eslint-disable */

const { QueryTypes } = require('sequelize');
const disk = require('diskusage');
const userid = require('userid');
const fs = require("fs");
const { access } = require('fs/promises');
const sequelize = require('../../config/database');
const GlobalSettings = require('../models/GlobalSettings');
const Storage = require('../models/Storage');
const Utils = require('../services/util.service');



const STRAGE_HEADER = 'Manage storage locations';
const ADD_LOCATION = 'Add location';
const LOCATION = 'Folder:';
const STORAGE_INFO_MESSAGE = 'Please note that if you add a new storage location, you need to make sure that: <br /> - folder exists <br /> - folder is empty <br /> - folder belongs to user bluecherry, group bluecherry.';
const DIR_DOES_NOT_EXIST_OR_NOT_READABLE = 'Server could not open the specified directory "<b>%PATH%</b>". See Note 2.';
const DIR_NOT_READABLE = 'Specified directory "<b>%PATH%</b>" exists, but is not readable. See Note 2.';
const DIR_NOT_EMPTY = 'Specified directory is not empty, all contents will be deleted after it is added.';
const DIR_OK = 'Specified directory exists and is writable. Click "save" to add this location.';


const ON_CARD = ' on Card ';
const MAP_PRESET = 'New preset...';

const StorageController = () => {

  const getFreeSpace = async (path) => {
    try {
      return disk.checkSync(path);
    } catch (err) {
      console.error(err)
      return {
        free: 0,
        available: 0,
        total: 0
      }
    }
  }
  const getData = async (req, res) => {
    try {
      const storages = await Storage.findAll();
      const storageData = [];
      for (const storage of storages) {
        const data = storage.toJSON();

        const path = data.path; //database::escapeString(data.path);
        const max_thresh = data.max_thresh; // database::escapeString(data.max_thresh);
        const { free, available, total } = getFreeSpace('/Volumes/Untitled/project/bluecherry/bluecherry-api');

        let available_space = (free - total * (1.0 - max_thresh/100) ) >> 20;
        if (available_space < 0)
          available_space = 0;
        const query = `SELECT (${available_space}) * period / size AS result FROM ( SELECT SUM(CASE WHEN end < start THEN 0 ELSE end - start END ) period, SUM(size) DIV 1048576 size  FROM Media WHERE filepath LIKE '{"${path}"}%') q`;
        console.log({
          query
        })
        const $result = await sequelize.query(query, { type: QueryTypes.SELECT });
        console.log({
          $result
        })
        data.record_time = $result[0]['result'];
        data.used_percent = Math.ceil((total - free) / total * 100);
        storageData.push(data)
      }
      // const settings = await utils.getAllGlobalSetting();

      return res.status(200).json({ storageData });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const is_readable = async (path) => {
    try {
      const ttt = await access(path, fs.constants.R_OK);
      console.log('can access', ttt);
      return true;

    } catch (err) {
      console.error('cannot access', { err });
      return false;
    }
  }

  const directory_status = async (path, type = '') => {
    // if file
    if (!fs.existsSync(path)){
      return ['F', DIR_DOES_NOT_EXIST_OR_NOT_READABLE.replace('%PATH%', path)];
    }

    const fileStates = fs.lstatSync(path)
    const $file_group = userid.groupname(fileStates.gid);
    if (!$file_group || ($file_group && $file_group !== 'bluecherry')) {
      return ['F', DIR_NOT_READABLE.replace('%PATH%', path)];
    }

    const $file_owner = userid.username(fileStates.uid);
    if (!$file_owner || ($file_owner && $file_owner !== 'bluecherry')) {
      return ['F', DIR_NOT_READABLE.replace('%PATH%', path)];
    }

    const isPathReadable = await is_readable(path);
    if (!isPathReadable) {
      return ['F', DIR_NOT_READABLE.replace('%PATH%', path)];
    }

    if (type === 'new'){
      const hasFiles = fs.readdirSync(path) || [];
      return (hasFiles.length === 2) ? ['OK', DIR_OK] : ['INFO', DIR_NOT_EMPTY.replace('%PATH%', path)];
    }

    return false;
  }

  const postData = async (req, res) => {
    try{
      const data = req.body;
      const records = [];

      for(const item in data){
        const {path, max} = data[item];

        if(!path){
          return res.status(404).json({ msg: 'Path is required' });
        }
        if(!max){
          return res.status(404).json({ msg: 'Max is required' });
        }
        const dir_status = await directory_status(path);

        if (dir_status){
          return res.status(dir_status[0] === 'F' ? 500 : 200).json({ msg: dir_status[1] });
        }
        const min = max - 10;
        // records.push({
        //   priority: item,
        //   path,
        //   max_thresh: max,
        //   min_thresh: min
        // })
        records.push(`(${item}, '${path}', ${max}, ${min})`)
      }

      await sequelize.query("DELETE FROM Storage", { type: QueryTypes.DELETE });

      const values = records.join(',');
      await sequelize.query(`INSERT INTO Storage (priority, path, max_thresh, min_thresh) VALUES ${values}`, { type: QueryTypes.INSERT });


      return res.status(200).json({ msg: "Storage updated" });
    } catch (e) {
      return res.status(500).json({ msg: 'Internal server error' });
    }
  }

  const storageCheck = async (req, res) => {
    try{
      const path = req.query.path;

      const dir_status = await directory_status(path, 'new');
      let status = 200;
      status = dir_status[0] === 'F' ? 500 : status
      status = dir_status[0] === 'INFO' ? 400 : status
      return res.status(status).json({ msg: dir_status[1] });
    } catch (e) {
      return res.status(500).json({ msg: 'Internal server error' });
    }
  }


  return {
    getData,
    postData,
    storageCheck
  };
};

module.exports = StorageController;
