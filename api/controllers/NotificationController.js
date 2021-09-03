/* eslint-disable */
const { QueryTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Devices = require('../models/Devices');
const User = require('../models/User');
const NotificationSchedules = require('../models/notificationSchedules');

const NotificationController = () => {

  const getData = async (req, res) => {
    try {
      const devices = await Devices.findAll();
      const users = await User.findAll();
      const notificationSchedules = await NotificationSchedules.findAll();

      return res.status(200).json({ devices, users, notificationSchedules });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };

  const trimChar = (string, charToRemove) => {
    while(string.charAt(0)==charToRemove) {
      string = string.substring(1);
    }

    while(string.charAt(string.length-1)==charToRemove) {
      string = string.substring(0,string.length-1);
    }

    return string;
  }
  const getDataById = async (req, res) => {
    try {
      let notificationSchedules = await NotificationSchedules.findByPk(req.params.id);
      notificationSchedules = notificationSchedules.toJSON();
      notificationSchedules.cameras = trimChar(notificationSchedules.cameras, '|').split('|') ;
      notificationSchedules.users = trimChar(notificationSchedules.users, '|').split('|') ;
      notificationSchedules.day = notificationSchedules.day ?  notificationSchedules.day.split('|') : [] ;


      return res.status(200).json({ notificationSchedules });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };

  const checkNotification = ({daysofweek, s_hr, e_hr, s_min, e_min, cameras, users}, t) => {
     if(!daysofweek){
        return t('NTF_E_DAYS')
     }
    if (s_hr>e_hr || (s_hr==e_hr && s_min>=e_min)){
      return t('NTF_E_TIME');
    }
    if (!cameras){
      return t('NTF_E_CAMS');
    }
    if (!users){
      return t('NTF_E_USERS');
    }
    return null;
  }

  const postData = async (req, res) => {
    try {
      const error = checkNotification(req.body, req.t)

      if(error){
        return res.status(400).json({ msg: error });
      }
      const { daysofweek, s_hr, s_min, e_hr, e_min, users, limit, cameras } = req.body
      const schedule = await NotificationSchedules.create({
        day: daysofweek.join(','),
        s_hr,
        s_min,
        e_hr,
        e_min,
        users: `|${users.join('|')}|`,
        limit: parseInt(limit),
        cameras: `|${cameras.join('|')}|`,
      })

      return res.status(200).json({ data: schedule });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };

  const toggleStatus = async (req, res) => {
    try {
      const id = req.params.id;
      if(!id){
        return res.status(404).json({ msg: 'Id is require' });
      }
      const notificationSchedules = await NotificationSchedules.findByPk(req.params.id);

      if(!notificationSchedules || (notificationSchedules && !notificationSchedules.id)){
        return res.status(404).json({ msg: 'record not found' });
      }
      notificationSchedules.disabled = !notificationSchedules.disabled;

      await notificationSchedules.save();


      return res.status(200).json({ data: notificationSchedules });
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

      const error = checkNotification(req.body, req.t)

      if(error){
        return res.status(400).json({ msg: error });
      }
      const { daysofweek, s_hr, s_min, e_hr, e_min, users, limit, cameras } = req.body

      const notificationSchedules = await NotificationSchedules.findByPk(req.params.id);

      if(!notificationSchedules || (notificationSchedules && !notificationSchedules.id)){
        return res.status(404).json({ msg: 'record not found' });
      }
      notificationSchedules.day = daysofweek.join(',');
      notificationSchedules.users = `|${users.join('|')}|`;
      notificationSchedules.nlimit = parseInt(limit);
      notificationSchedules.cameras = `|${cameras.join('|')}|`;
      notificationSchedules.s_hr = s_hr;
      notificationSchedules.s_min = s_min;
      notificationSchedules.e_hr = e_hr;
      notificationSchedules.e_min = e_min;

      await notificationSchedules.save();

      return res.status(200).json({ data: notificationSchedules });
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

      const notificationSchedules = await NotificationSchedules.findByPk(req.params.id);
      await notificationSchedules.destroy();

      return res.status(200).json({ msg: 'Record has been deleted successfully', data: notificationSchedules });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };

  return {
    getData,
    postData,
    getDataById,
    editData,
    toggleStatus,
    removeDataById,
  };
};

module.exports = NotificationController;
