/* eslint-disable */
const Devices = require('../models/Devices');
const Webhooks = require('../models/webhooks');

const WebhookController = () => {

  const getData = async (req, res) => {
    try {
      const devices = await Devices.findAll();
      let webhooks = await Webhooks.findAll();
      const events = ['motion_event', 'device_state', 'solo'];

      webhooks = webhooks.map(item => {
        const data = item.toJSON();
        data.events = data.events ? data.events.split(',') : [];
        data.cameras = data.cameras ? data.cameras.split(',') : [];
        return data
      })

      return res.status(200).json({ devices, webhooks, events });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
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
      let webhook = await Webhooks.findByPk(req.params.id);
      webhook = webhook.toJSON();
      webhook.events = webhook.events ? data.events.split(',') : [];
      webhook.cameras = webhook.cameras ? data.cameras.split(',') : [];


      return res.status(200).json({ webhook });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };

  const postData = async (req, res) => {
    try {
      const error = validateData(req.body, req.t)

      if(error){
        return res.status(400).json({ msg: error });
      }
      const { label, url, events, status, cameras } = req.body
      const schedule = await Webhooks.create({
        label,
        url,
        status: status === 0 ? 1 : 0,
        events: events ? events.join(',') : '',
        cameras: cameras ? cameras.join(',') : ''
      })

      return res.status(200).json({ data: schedule });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
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
      const { label, url, events, status, cameras } = req.body

      const webhook = await Webhooks.findByPk(req.params.id);

      if(!webhook || (webhook && !webhook.id)){
        return res.status(404).json({ msg: 'record not found' });
      }
      webhook.label = label;
      webhook.url = url;
      webhook.status= status === 0 ? 1 : 0
      webhook.events= events ? events.join(',') : '';
      webhook.cameras= cameras ? cameras.join(',') : ''

      await webhook.save();

      return res.status(200).json({ data: webhook });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };

  const removeDataById = async (req, res) => {
    try {
      const id = req.params.id;
      if(!id){
        return res.status(404).json({ msg: 'Id is require' });
      }

      const webhook = await Webhooks.findByPk(req.params.id);
      await webhook.destroy();

      return res.status(200).json({ msg: 'Record has been deleted successfully', data: webhook });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
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

module.exports = WebhookController;
