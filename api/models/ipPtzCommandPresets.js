const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'ipPtzCommandPresets';

const ipPtzCommandPresets = sequelize.define('ipPtzCommandPresets', {
  user_id: {
    type: Sequelize.INTEGER,
  },
  name: {
    type: Sequelize.STRING(128),
    allowNull: false,
  },
  driver: {
    type: Sequelize.STRING(12),
    defaultValue: '',
  },
  mright: {
    type: Sequelize.STRING(128),
    allowNull: false,
  },
  mleft: {
    type: Sequelize.STRING(128),
    allowNull: false,
  },
  up: {
    type: Sequelize.STRING(128),
    allowNull: false,
  },
  down: {
    type: Sequelize.STRING(128),
    allowNull: false,
  },
  up_right: {
    type: Sequelize.STRING(128),
    allowNull: false,
  },
  up_left: {
    type: Sequelize.STRING(128),
    allowNull: false,
  },
  down_right: {
    type: Sequelize.STRING(128),
    allowNull: false,
  },
  down_left: {
    type: Sequelize.STRING(128),
    allowNull: false,
  },
  wide: {
    type: Sequelize.STRING(128),
    allowNull: false,
  },
  tight: {
    type: Sequelize.STRING(128),
    allowNull: false,
  },
  focus_in: {
    type: Sequelize.STRING(128),
    allowNull: false,
  },
  focus_out: {
    type: Sequelize.STRING(128),
    allowNull: false,
  },
  preset_save: {
    type: Sequelize.STRING(128),
    allowNull: false,
  },
  preset_go: {
    type: Sequelize.STRING(128),
    allowNull: false,
  },
  stop: {
    type: Sequelize.STRING(128),
    allowNull: false,
  },
  stop_zoom: {
    type: Sequelize.STRING(128),
    defaultValue: '',
  },
  needs_stop: {
    type: Sequelize.BOOLEAN,
    defaultValue: 0,
    allowNull: false,
  },
  http_auth: {
    type: Sequelize.BOOLEAN,
    defaultValue: 1,
    allowNull: false,
  },
  custom: {
    type: Sequelize.BOOLEAN,
    defaultValue: 0,
    allowNull: false,
  },
  port: {
    type: Sequelize.STRING(5),
    defaultValue: '80',
    allowNull: false,
  },
  protocol: {
    type: Sequelize.STRING(10),
    defaultValue: 'http',
  },
}, { tableName });

// eslint-disable-next-line
ipPtzCommandPresets.prototype.toJSON = function () {
  return Object.assign({}, this.get());
};

module.exports = ipPtzCommandPresets;
