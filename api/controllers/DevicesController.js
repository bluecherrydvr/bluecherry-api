/* eslint-disable */
const { QueryTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Devices = require('../models/Devices');

const DevicesController = () => {
  const getAll = async (req, res) => {
    try {
      const users = await Devices.findAll();

      return res.status(200).json({ users });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const getCameras = async (req, res) => {
    try {
      const users = await sequelize.query("SELECT dvs.* FROM Devices as dvs INNER JOIN EventsCam as m ON dvs.id=m.device_id WHERE m.type_id='motion' OR m.type_id='continuous' GROUP BY dvs.id", { type: QueryTypes.SELECT });
      // const users = await Devices.findAll();

      console.log({
        users,
      });
      return res.status(200).json({ users });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const setPlayBack = async (req, res) => {
    try {
      const {
        motion_events,
        continuous_events,
        start,
        end,
        device_id,
      } = req.body;

      let users = {};
      if (motion_events || continuous_events) {
        let $where_add = '';
        if (start) $where_add += ` AND EventsCam.time >= ${parseInt((new Date(start).getTime() / 1000).toFixed(0), 0)}`;
        if (end) $where_add += ` AND EventsCam.time <= ${parseInt((new Date(end).getTime() / 1000).toFixed(0), 0)}`;

        if (motion_events && continuous_events) {
          $where_add += " AND (type_id='motion' OR type_id='continuous')";
        } else {
          if (motion_events) $where_add += " AND type_id='motion'";
          if (continuous_events) $where_add += " AND type_id='continuous'";
        }

        const query = `SELECT EventsCam.*, Devices.device_name, Media.id as media_id, Media.size AS media_size, Media.start, Media.end, ((Media.size>0 OR Media.end=0) AND Media.filepath!='') AS media_available
        FROM EventsCam
        LEFT JOIN Media ON (EventsCam.media_id=Media.id)
        LEFT JOIN Devices ON (EventsCam.device_id=Devices.id)
        WHERE EventsCam.device_id=${device_id}
        ${$where_add}
        ORDER BY EventsCam.time DESC
        `;
        users = await sequelize.query(query, { type: QueryTypes.SELECT });
      }

      // const query = 'SELECT EventsCam.*, Devices.device_name, Media.id as media_id, Media.size AS media_size,
      // Media.start, Media.end, ((Media.size>0 OR Media.end=0) AND Media.filepath!=\'\') AS media_available
      // FROM EventsCam LEFT JOIN Media ON (EventsCam.media_id=Media.id)
      // LEFT JOIN Devices ON (EventsCam.device_id=Devices.id) WHERE EventsCam.device_id=${device_id}
      // AND EventsCam.time >= 1629158400 AND EventsCam.time <= 1629244740
      // AND (type_id=\'motion\' OR type_id=\'continuous\') ORDER BY EventsCam.time DESC ';
      // const users = await Devices.findAll();

      console.log({
        users,
      });
      return res.status(200).json({ users });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  const getCards = async (req, res) => {
    try{
      const query = `SELECT card_id FROM AvailableSources GROUP BY card_id`;
      const AvailableSources = await sequelize.query(query, { type: QueryTypes.SELECT });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  }

  const getIpCameras = async (req, res) => {
    try{

    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  }

  const getDatas = async (req, res) => {
    try{

    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  }


  return {
    getAll,
    getCameras,
    setPlayBack,
    getDatas
  };
};

module.exports = DevicesController;
