const Sequelize = require('sequelize');

const sequelize = require('../../config/database');
const Devices = require('./Devices');

const tableName = 'PTZPresets';

const PTZPresets = sequelize.define('PTZPresets', {
  device_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: Devices,
      key: 'id',
    },
  },
  preset_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  preset_name: {
    type: Sequelize.STRING,
  },
}, {
  tableName, timestamps: false, createdAt: false, updatedAt: false,
});

// eslint-disable-next-line
PTZPresets.prototype.toJSON = function () {
  return Object.assign({}, this.get());
};

module.exports = PTZPresets;
