const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'notificationSchedules';

const notificationSchedules = sequelize.define('notificationSchedules', {
  day: {
    type: Sequelize.STRING(64),
    allowNull: false,
  },
  s_hr: {
    type: Sequelize.TINYINT,
    allowNull: false,
  },
  s_min: {
    type: Sequelize.TINYINT,
    allowNull: false,
  },
  e_hr: {
    type: Sequelize.TINYINT,
    allowNull: false,
  },
  e_min: {
    type: Sequelize.TINYINT,
    allowNull: false,
  },
  cameras: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  users: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  nlimit: {
    type: Sequelize.MEDIUMINT.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  },
  disabled: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, { tableName });

// eslint-disable-next-line
notificationSchedules.prototype.toJSON = function () {
  return Object.assign({}, this.get());
};

module.exports = notificationSchedules;
