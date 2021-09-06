/* eslint-disable camelcase */
const Utils = require('../services/util.service');
const fs = require('fs');

const LogsController = () => {
  const utils = Utils();
  const VAR_WWW_LOG_PATH = '/var/log/nginx/bluecherry-error.log';
  const VAR_LOG_PATH = '/var/log/bluecherry.log';

  const nl2br = (str, replaceMode, isXhtml) => {
    const breakTag = (isXhtml) ? '<br />' : '<br>';
    const replaceStr = (replaceMode) ? `$1${breakTag}` : `$1${breakTag}$2`;
    return (`${str}`).replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, replaceStr);
  };

  const GetLog = async (logPath, lines, t) => {
    try {
      let content;
      if (lines && lines === 'all') {
        content = await fs.readFileSync(logPath);
      } else {
        // eslint-disable-next-line no-param-reassign
        lines = !lines ? 20 : parseInt(lines, 0);
        // get VAR_LOG_PATH file {lines} last lines, explode by
        // new line chars and filter out empty lines
        const returnVar = await utils.execPromise(`tail -n ${lines} ${logPath}`);

        content = nl2br(returnVar);
        content = content.split('\n');
      }
      return (!content) ? t('LOG_EMPTY') : content;
    } catch (e) {
      return null;
    }
  };

  const preData = async ({ type, lines }, t) => {
    const logType = type || false;

    let logSize = t('LOG_FILE_DOES_NOT_EXIST');

    let logPath = '';
    switch (logType) {
      case 'www':
        logPath = VAR_WWW_LOG_PATH;
        break;
      default:
        logPath = VAR_LOG_PATH;
        break;
    }
    let log = [];

    if (fs.existsSync(logPath)) {
      log = await GetLog(logPath, lines, t);
      const stats = fs.statSync(logPath);
      logSize = stats.size;
    }
    return {
      log,
      logSize,
      type: logType,
    };
  };
  const getData = async (req, res) => {
    try {
      const data = await preData(req.query, req.t);
      return res.status(200).json({ data });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };

  const downloadLogs = async (req, res) => {
    try {
      // get the computer info/dmesg log
      await utils.execPromise('lshw > /tmp/sysinfo.txt; dmesg > /tmp/dmesg.txt;');
      // tar the logs
      await utils.execPromise(`tar -cf ${req.t('VAR_TARRED_LOGS_TMP_LOCATION')} ${req.t('VAR_LOG_PATH')} ${req.t('VAR_WWW_LOG_PATH')} /tmp/dmesg.txt /tmp/sysinfo.txt > /dev/null`);

      const files = fs.readFileSync(req.t('VAR_TARRED_LOGS_TMP_LOCATION'), { encoding: 'base64' });
      // output the tarred files
      res.writeHead(200, {
        'Content-Description': 'File Transfer',
        'Content-Type': 'application/octet-stream',
        'Content-Length': files.size,
      });

      return res.download(req.t('VAR_TARRED_LOGS_TMP_LOCATION'));
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };


  return {
    getData,
    downloadLogs,
  };
};

module.exports = LogsController;
