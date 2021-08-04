const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'ActiveUsers';

const ActiveUsers = sequelize.define('ActiveUsers', {
  ip: {
    type: Sequelize.STRING,
  },
  from_client: {
    type: Sequelize.BOOLEAN,
  },
  time: {
    type: Sequelize.STRING,
  },
  kick: {
    type: Sequelize.BOOLEAN,
  },
}, { tableName });

// eslint-disable-next-line
ActiveUsers.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  delete values.password;

  return values;
};

module.exports = ActiveUsers;
