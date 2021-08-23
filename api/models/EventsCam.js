const Sequelize = require('sequelize');

const sequelize = require('../../config/database');
const Media = require('./Media');
const EventLevels = require('./EventLevels');
const Devices = require('./Devices');
const EventTypesCam = require('./EventTypesCam');

const tableName = 'EventsCam';

const EventsCam = sequelize.define('EventsCam', {
  time: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  level_id: {
    type: Sequelize.STRING(10),
    references: {
      model: EventLevels,
      key: 'id',
    },
  },
  device_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Devices,
      key: 'id',
    },
  },
  type_id: {
    type: Sequelize.STRING(10),
    references: {
      model: EventTypesCam,
      key: 'id',
    },
  },
  length: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  archive: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  media_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Media,
      key: 'id',
    },
  },
  details: {
    type: Sequelize.TEXT,
  },
}, {
  tableName, timestamps: false, createdAt: false, updatedAt: false,
});

// eslint-disable-next-line
EventsCam.prototype.toJSON = function () {
  return Object.assign({}, this.get());
};

module.exports = EventsCam;
