const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'GlobalSettings';

const GlobalSettings = sequelize.define('GlobalSettings', {
  parameter: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false,
  },
  value: {
    type: Sequelize.STRING,
  },
}, { tableName });

// eslint-disable-next-line
GlobalSettings.prototype.toJSON = function () {
  return Object.assign({}, this.get());
};

module.exports = GlobalSettings;
