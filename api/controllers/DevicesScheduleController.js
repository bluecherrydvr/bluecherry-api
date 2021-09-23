/* eslint-disable camelcase,max-len */
const { QueryTypes } = require('sequelize');
const sequelize = require('../../config/database');
const Devices = require('../models/Devices');

const DevicesScheduleController = () => {
  const getAll = async (req, res) => {
    try {
      const users = await Devices.findAll();

      return res.status(200).json({ users });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };

  const getData = async (req, res) => {
    try {
      const id = req.query.id || 'global';
      const deviceSchedule = {
        device_data: [],
      };

      const query = id !== 'global' ? `SELECT id, device_name, protocol, schedule, schedule_override_global, onvif_events_enabled FROM Devices WHERE id=${id}` : 'SELECT value as schedule FROM GlobalSettings WHERE parameter=\'G_DEV_SCED\'';
      deviceSchedule.schedule_data = await sequelize.query(query, { type: QueryTypes.SELECT });

      if (id !== 'global' && (!deviceSchedule.schedule_data || deviceSchedule.schedule_data.length < 1 || (deviceSchedule.schedule_data && deviceSchedule.schedule_data[0] && !deviceSchedule.schedule_data[0].data))) {
        const global_schedule = await sequelize.query("SELECT value as schedule FROM GlobalSettings WHERE parameter='G_DEV_SCED'", { type: QueryTypes.SELECT });
        await sequelize.query(`UPDATE Devices SET schedule='${global_schedule[0].schedule}' WHERE id=${id}`, { type: QueryTypes.UPDATE });
        deviceSchedule.schedule_data = await sequelize.query(query, { type: QueryTypes.SELECT });
      }

      if (id === 'global') {
        deviceSchedule.device_data[0].id = 'global';
      }

      const data = {
        deviceSchedule,
        global: id === 'global',
        og: (!deviceSchedule.schedule_data || deviceSchedule.schedule_data.length < 1 || (deviceSchedule.schedule_data && deviceSchedule.schedule_data[0] && !deviceSchedule.schedule_data[0].schedule_override_global)) ? false : deviceSchedule.schedule_data[0].schedule_override_global,
      };

      return res.status(200).json({ data });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };

  const postData = async (req, res) => {
    try {
      let status = true;
      req.body.G_DISABLE_VERSION_CHECK = (!(req.body.G_DISABLE_VERSION_CHECK)) ? 1 : 0;
      req.body.G_DISABLE_IP_C_CHECK = req.body.G_DISABLE_IP_C_CHECK ? 1 : 0;
      req.body.G_DISABLE_WEB_STATS = req.body.G_DISABLE_WEB_STATS ? 1 : 0;

      const keys = Object.keys(req.body);

      // eslint-disable-next-line no-restricted-syntax
      for (const key of keys) {
        if (key.indexOf('G_') <= -1) {
          // eslint-disable-next-line no-continue
          continue;
        }
        // eslint-disable-next-line no-await-in-loop
        status = await sequelize.query(`INSERT INTO GlobalSettings (parameter, value) VALUES ('${key}', '${keys[key]}') ON DUPLICATE KEY UPDATE value='${keys[key]}'`, { type: QueryTypes.INSERT });
      }
      return res.status(200).json({ status, msg: 'Scheduling data has been updated' });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };

  return {
    getAll,
    getData,
    postData,
  };
};

module.exports = DevicesScheduleController;
