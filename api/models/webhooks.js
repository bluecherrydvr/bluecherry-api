const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'webhooks';

const webhooks = sequelize.define('webhooks', {
  label: {
    type: Sequelize.STRING(50),
    allowNull: false,
  },
  url: {
    type: Sequelize.STRING(255),
    allowNull: false,
  },
  events: {
    type: Sequelize.STRING(255),
  },
  cameras: {
    type: Sequelize.STRING(255),
  },
  status: {
    type: Sequelize.TINYINT,
    defaultValue: 0,
  },
  last_update: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false,
  },
}, { tableName });

// eslint-disable-next-line
webhooks.prototype.toJSON = function () {
  return Object.assign({}, this.get());
};

module.exports = webhooks;
