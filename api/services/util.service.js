/* eslint-disable no-param-reassign */
const fs = require('fs');
const GlobalSettings = require('../models/GlobalSettings');

const utils = () => {
  const getGlobalSetting = async (settingName) => {
    try {
      const data = await GlobalSettings.findOne({ where: { parameter: settingName } });
      return data.toJSON();
    } catch (e) {
      return null;
    }
  };

  const getAllGlobalSetting = async () => {
    try {
      const settings = await GlobalSettings.findAll();
      const data = {};
      // eslint-disable-next-line no-restricted-syntax
      for (const setting of settings) {
        const values = setting.toJSON();
        data[values.parameter] = values.value;
      }
      return data;
    } catch (e) {
      return null;
    }
  };

  const getLiveViewVideoOptions = () => ['HLS', 'MJPEG'];

  const getRenderNodes = () => {
    const ret = [];

    // eslint-disable-next-line no-plusplus
    for (let $i = 0; $i < 4; $i++) {
      // eslint-disable-next-line radix
      const node = `/dev/dri/renderD${parseInt($i + 128)}`;
      if (fs.existsSync(node)) {
        const stats = fs.statSync(node);
        if (stats.isCharacterDevice()) {
          ret.push(node);
        }
      }
    }

    return ret;
  };

  const getVaapiOptions = () => {
    let ret = [
      'None',
    ];
    const nodes = getRenderNodes();
    if (!nodes) {
      ret = ret.const(nodes);
    }
    ret.push('Autodetect');

    return ret;
  };

  // const downloadFile = async (filePath, file_name = '', delete_file = true, HTTP_RANGE) => {
  //   // if(!fs.existsSync(path_to_image)){
  //   const $fp = null;
  //   if (fs.existsSync(filePath)) {
  //     const stats = fs.statSync(filePath);
  //     const fileInfo = {
  //       name: path.basename(file_name),
  //       size: stats.size,
  //     };
  //
  //     let range = 0;
  //     if (HTTP_RANGE) {
  //       range = HTTP_RANGE;
  //       range = range.replace('bytes=', '');
  //       range = range.replace('-', '');
  //       if (range) {
  //         fseek($fp, range);
  //       }
  //     }
  //
  //     session_write_close();
  //     if (ob_get_length()) ob_end_clean();
  //     if (delete_file) unlink(filePath);
  //
  //     header('Content-Description: Archive File');
  //     header('Content-Type: application/octet-stream');
  //     header('Expires: 0');
  //     header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
  //     header('Pragma: public');
  //     header('Accept-Ranges: bytes');
  //     if (fileInfo.name) {
  //       header('Content-Disposition: attachment; filename='.fileInfo.name);
  //     }
  //
  //     if (range) {
  //       header(`Content-Range: bytes ${range}-${fileInfo.size - 1}/${fileInfo.size}`);
  //       header(`Content-Length:${fileInfo.size - range}`);
  //
  //       header(`${$_SERVER.SERVER_PROTOCOL} 206 Partial Content`);
  //     } else {
  //       header('Content-Length:'.fileInfo.size);
  //
  //       header(`${$_SERVER.SERVER_PROTOCOL} 200 OK`);
  //     }
  //
  //
  //     while (!feof($fp)) {
  //       print(fread($fp, 8192));
  //       flush();
  //     }
  //     fclose($fp);
  //   } else {
  //     header('HTTP/1.0 500 Internal Server Error - weird: cannot read just-written file');
  //   }
  // };

  const throwError = (code = 500, errorType, errorMessage) => (error) => {
    if (!error) error = new Error(errorMessage || 'Default Error');
    error.code = code;
    error.errorType = errorType;
    throw error;
  };

  return {
    getGlobalSetting,
    getVaapiOptions,
    getLiveViewVideoOptions,
    getAllGlobalSetting,
    throwError,
  };
};

module.exports = utils;
