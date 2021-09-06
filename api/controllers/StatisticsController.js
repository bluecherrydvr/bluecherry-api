/* eslint-disable camelcase */
const { QueryTypes } = require('sequelize');
const sequelize = require('../../config/database');

const StatisticsController = () => {
  const format = 'Y-m-d H:i:s';
  let type = '';
  let eventType;
  const results = {};
  let result;
  let totalRecords;
  const query_params = {
    year: '%y',
    month: '%m',
    day: '%d',
    hour: '%h', // ,
    // 'minute' => '%i',
    // 'second' => '%s'
  };
  const getFirstLast = async () => {
    try {
      result = await sequelize.query('SELECT id, time FROM EventsCam ORDER BY id ASC LIMIT 1', { type: QueryTypes.SELECT });
      console.log({
        result,
      });
      const firstEvent = new Date(result[0].time * 1000);
      results.firstEvent = `${firstEvent.getFullYear()}-${firstEvent.getMonth()}-${firstEvent.getDay()} ${firstEvent.getHours()}:${firstEvent.getMinutes()}:${firstEvent.getSeconds()}`;


      result = await sequelize.query('SELECT id, time FROM EventsCam ORDER BY id ASC LIMIT 1', { type: QueryTypes.SELECT });
      const lastEvent = new Date(result[0].time * 1000);
      results.lastEvent = `${lastEvent.getFullYear()}-${lastEvent.getMonth()}-${lastEvent.getDay()} ${lastEvent.getHours()}:${lastEvent.getMinutes()}:${lastEvent.getSeconds()}`;

      return {
        firstEvent,
        lastEvent,
      };
    } catch (err) {
      console.log({
        err,
      });
      return {
        firstEvent: null,
        lastEvent: null,
      };
    }
  };

  const setStatVar = () => {
    const statistics = {};
    statistics.type = type;
    statistics.eventType = eventType;
    statistics.results = results;
    statistics.result = result;
    statistics.totalRecords = totalRecords;

    return statistics;
  };


  const getData = async (req, res) => {
    try {
      const data = {};

      await getFirstLast(format);
      console.log({
        results,
      });
      data.statistics = setStatVar();
      data.query_params = query_params;
      data.date_format = format;

      return res.status(200).json({ data });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };

  const dbData = async (data, $query_params) => {
    try {
      let where = "WHERE type_id != 'not found' ";
      if (data.start && data.end) {
        where = `${where} AND time>=${data.start} AND time<=${data.end}`;
      }
      if (!data.event_filter.all_events &&
          (data.event_filter.motion_events || data.event_filter.continuous_events) &&
          !(data.event_filter.motion_events && data.event_filter.continuous_events)) {
        eventType = (data.event_filter.motion_events) ? 'motion' : 'continuous';
        where = `${where} AND type_id = '${eventType}'`;
      }
      const query = `SELECT count(*) as counter, DATE_FORMAT(FROM_UNIXTIME(time),'${$query_params[data.primary_grouping]}') as '${data.primary_grouping}', DATE_FORMAT(FROM_UNIXTIME(time),'${$query_params[data.secondary_grouping]}') as '${data.secondary_grouping}' FROM EventsCam ${where} GROUP BY ${data.primary_grouping}, ${data.secondary_grouping}`;
      result = await sequelize.query(query, { type: QueryTypes.SELECT });
      totalRecords = (await sequelize.query(`SELECT id FROM EventsCam ${where}`, { type: QueryTypes.SELECT })).length; // count(data::query("SELECT id FROM EventsCam {where}"));
      return {
        result,
        totalRecords,
      };
    } catch (e) {
      return null;
    }
  };

  const getStatistics = async (req, res) => {
    try {
      const data = {};
      const {
        primary_grouping,
        secondary_grouping,
        start,
        end,
        all_events,
        motion_events,
        continuous_events,
      } = req.body;
      data.primary_grouping = primary_grouping || false;
      data.secondary_grouping = secondary_grouping || false;
      data.start = (new Date(start).getTime()) / 1000;
      data.end = (new Date(end).getTime()) / 1000;
      data.event_filter = {};
      data.event_filter.all_events = (all_events && all_events === 'on');
      data.event_filter.motion_events = (motion_events && motion_events === 'on');
      data.event_filter.continuous_events = (continuous_events && continuous_events === 'on');
      // if type not set return html
      type = req.body.type || 'html';

      await dbData(data, query_params);
      data.statistics = setStatVar();
      data.query_params = query_params;
      data.date_format = format;

      return res.status(200).json({ data });
    } catch (err) {
      return res.status(500).json({ msg: 'Internal server error', err });
    }
  };

  return {
    getFirstLast,
    getData,
    getStatistics,
  };
};

module.exports = StatisticsController;
