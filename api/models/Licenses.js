const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'Licenses';

const Licenses = sequelize.define('Licenses', {
  license: {
    type: Sequelize.STRING(64),
    primaryKey: true,
    allowNull: false,
  },
  authorization: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  added: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
}, { tableName });

// eslint-disable-next-line
Licenses.prototype.toJSON = function () {
  return Object.assign({}, this.get());
};

module.exports = Licenses;
