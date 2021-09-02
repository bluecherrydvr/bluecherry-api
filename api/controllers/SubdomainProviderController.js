/* eslint-disable */
const Devices = require('../models/Devices');
const Webhooks = require('../models/webhooks');
const Utils = require('../services/util.service');
const subdomainProviderBase = require('../services/subdomainProviderBase.service');

const SubdomainProviderController = () => {
  const utils = Utils();

  const getData = async (req, res) => {
    try {

      const settings = await utils.getAllGlobalSetting();
      const data = {
        actualSubdomain : '',
        actualEmail : settings.G_SUBDOMAIN_EMAIL_ACCOUNT,
        actualIpv4Value : '',
        actualIpv6Value : '',
        autoUpdateIpv4 : settings.G_SUBDOMAIN_AUTO_UPDATE_IPV4,
        autoUpdateIpv6 : settings.G_SUBDOMAIN_AUTO_UPDATE_IPV6,
        licenseIdExists : false
      }

      try {
        await subdomainProviderBase.getLicenseKey();
      } catch (e) {
        data.licenseIdExists = false;
        return res.status(200).json({ data });
      }

      data.licenseIdExists = true;

      // Call '/actual-configuration' api
      let actualConfig;
      try {
        actualConfig = await subdomainProviderBase.getFromApiWithToken('/actual-configuration');
      } catch (error) {
        return res.status(200).json({ data });
      }

      if (!actualConfig) {
        data.actualSubdomain = actualConfig.subdomain;

        for (const record of actualConfig.records) {
          switch (record.type) {
            case 'a': data.actualIpv4Value = record.value; break;
            case 'aaaa' : data.actualIpv6Value = record.value; break;
          }
        }
      }

      return res.status(200).json({ data });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const validateData = ({label, url, events, status, cameras}, t) => {
    if(!label){
      return t('Label is not defined')
    }
    if (!url){
      return t('URL is not defined')
    }
    if (!events || (events && events.length <= 0)){
      return t('Events is not defined')
    }
    if (!status){
      return t('status is not defined')
    }
    if (!cameras || (cameras && cameras.length <= 0)){
      return t('cameras is not defined')
    }
    return null;
  }

  const getDataById = async (req, res) => {
    try {

      return res.status(200).json({ webhook: [] });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const postData = async (req, res) => {
    try {
      const error = validateData(req.body, req.t)

      if(error){
        return res.status(400).json({ msg: error });
      }

      return res.status(200).json({ });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const editData = async (req, res) => {
    try {
      const id = req.params.id;
      if(!id){
        return res.status(404).json({ msg: 'Id is require' });
      }

      const error = validateData(req.body, req.t)

      if(error){
        return res.status(400).json({ msg: error });
      }
      return res.status(200).json({ });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const removeDataById = async (req, res) => {
    try {
      const id = req.params.id;
      if(!id){
        return res.status(404).json({ msg: 'Id is require' });
      }

      return res.status(200).json({ msg: 'Record has been deleted successfully', data: '' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  return {
    getData,
    getDataById,
    postData,
    editData,
    removeDataById
  };
};

module.exports = SubdomainProviderController;
