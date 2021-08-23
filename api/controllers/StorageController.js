/* eslint-disable */

const { QueryTypes } = require('sequelize');
const sequelize = require('../../config/database');
const GlobalSettings = require('../models/GlobalSettings');
const Utils = require('../services/util.service');
const MailService = require('../services/mail.service');

const StorageController = () => {
  const utils = Utils();
  const mail = MailService();
  const getAllSettings = async (req, res) => {
    try {
      const settings = await utils.getAllGlobalSetting();
      const getVaapiOptions = utils.getVaapiOptions()
      const getLiveViewVideoOptions = utils.getLiveViewVideoOptions()
      const validSecureOptions = {
        "tls": "TLS",
        "ssl": "SSL",
        "none": "L_NONE",
    }

      return res.status(200).json({ settings, getVaapiOptions, validSecureOptions, getLiveViewVideoOptions });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const updateData = async (key, values) => {
    try{
      await GlobalSettings.update({ 'value' : values }, {
        where: {
          'parameter': key
        }
      });
      return true;
    } catch (e) {
      return false
    }
  }

  const saveAllSettings = async (req, res) => {
    try {
      const params = ["G_DEV_NOTES",
        "G_DEV_SCED",
        "G_DISABLE_IP_C_CHECK",
        "G_DISABLE_VERSION_CHECK",
        "G_DISABLE_WEB_STATS",
        "G_DVR_EMAIL",
        "G_DVR_NAME",
        "G_IPCAMLIST_VERSION",
        "G_LAST_SOFTWARE_VERSION_CHECK",
        "G_LIVEVIEW_VIDEO_METHOD",
        "G_SMTP_FAIL",
        "G_SMTP_HOST",
        "G_SMTP_PASSWORD",
        "G_SMTP_PORT",
        "G_SMTP_SERVICE",
        "G_SMTP_SSL",
        "G_SMTP_USERNAME",
        "G_SUBDOMAIN_API_BASE_URL",
        "G_SUBDOMAIN_EMAIL_ACCOUNT",
        "G_VAAPI_DEVICE"];

      const fieldsUpdatedStatus = [];
      for(const param of params){
        console.log({
          t: req.body[param],
          param,
          tt: req.body[param] !== undefined
        })
        if( req.body[param] !== undefined){
          fieldsUpdatedStatus[param] = await updateData(param, req.body[param])
        }
      }

      const fieldsNotUpdated = fieldsUpdatedStatus.map(item => !item)

      return res.status(200).json({ msg: 'Setting has been updated successfully',  fieldsNotUpdated: fieldsNotUpdated, fieldsUpdatedStatus});
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const sendTestEmail = async (req, res) => {
    try {
      if(!req.body.email){
        return res.status(404).json({ msg: 'Email address not found' });
      }
      const data = await mail.sendMail(req.body.email, null, true);

      return res.status(200).json({ msg: 'Testing mail sent successfully',  data});
    } catch (err) {

      console.log({
        err
      });
      return res.status(500).json({ msg: 'Internal server error' });
    }
  }

  return {
    getAllSettings,
    saveAllSettings,
    sendTestEmail
  };
};

module.exports = StorageController;
