const Sequelize = require('sequelize');
const bcryptService = require('../services/bcrypt.service');

const sequelize = require('../../config/database');

const hooks = {
  beforeCreate(user) {
    user.password = bcryptService().password(user); // eslint-disable-line no-param-reassign
  },
};

const tableName = 'Users';

const User = sequelize.define('Users', {
  email: {
    type: Sequelize.STRING,
    unique: true,
  },
  username: {
    type: Sequelize.STRING(40),
    unique: true,
  },
  password: {
    type: Sequelize.STRING(64),
  },
  salt: {
    type: Sequelize.STRING(4),
  },
  name: {
    type: Sequelize.STRING(60),
  },
  phone: {
    type: Sequelize.STRING(15),
  },
  notes: {
    type: Sequelize.STRING(2000),
  },
  asses_setup: {
    type: Sequelize.BOOLEAN,
  },
  asses_remote: {
    type: Sequelize.BOOLEAN,
  },
  asses_web: {
    type: Sequelize.BOOLEAN,
  },
  asses_backup: {
    type: Sequelize.BOOLEAN,
  },
  asses_relay: {
    type: Sequelize.BOOLEAN,
  },
  asses_device_list: {
    type: Sequelize.STRING,
  },
  asses_ptz_list: {
    type: Sequelize.STRING,
  },
  asses_schedule: {
    type: Sequelize.STRING(128),
  },
  change_password: {
    type: Sequelize.BOOLEAN,
  },
}, { hooks, tableName });

// eslint-disable-next-line
User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  delete values.password;

  return values;
};

module.exports = User;
