const Sequelize = require('sequelize');

const sequelize = require('../../config/database');
const Devices = require('./Devices');

const tableName = 'OnvifEvents';

const OnvifEvents = sequelize.define('OnvifEvents', {
  device_id: {
    type: Sequelize.STRING(10),
    allowNull: false,
    references: {
      model: Devices,
      key: 'id',
    },
  },
  event_time: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: 0,
  },
  onvif_topic: {
    type: Sequelize.STRING,
  },
}, {
  tableName, timestamps: false, createdAt: false, updatedAt: false,
});

// eslint-disable-next-line
OnvifEvents.prototype.toJSON = function () {
  return Object.assign({}, this.get());
};

module.exports = OnvifEvents;
