const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'ActiveUsers';

const ActiveUsers = sequelize.define('ActiveUsers', {
  ip: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  from_client: {
    type: Sequelize.BOOLEAN,
  },
  userId: {
    type: Sequelize.STRING,
  },
  time: {
    type: Sequelize.STRING,
  },
  kick: {
    type: Sequelize.BOOLEAN,
  },
  token: {
    type: Sequelize.STRING,
  },
}, {
  tableName, timestamps: false, createdAt: false, updatedAt: false,
});

// eslint-disable-next-line
ActiveUsers.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  delete values.password;

  return values;
};

module.exports = ActiveUsers;
