const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'ServerStatus';

const ServerStatus = sequelize.define('ServerStatus', {
  pid: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  timestamp: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  message: {
    type: Sequelize.TEXT,
  },
}, {
  tableName, timestamps: false, createdAt: false, updatedAt: false,
});

// eslint-disable-next-line
ServerStatus.prototype.toJSON = function () {
  return Object.assign({}, this.get());
};

module.exports = ServerStatus;
