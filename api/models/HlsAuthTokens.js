const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'HlsAuthTokens';

const HlsAuthTokens = sequelize.define('HlsAuthTokens', {
  user_id: {
    type: Sequelize.INTEGER,
  },
  token: {
    type: Sequelize.STRING,
  },
  date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  },
}, { tableName });

// eslint-disable-next-line
HlsAuthTokens.prototype.toJSON = function () {
  return Object.assign({}, this.get());
};

module.exports = HlsAuthTokens;
