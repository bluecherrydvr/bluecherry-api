const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'notificationsSent';

const notificationsSent = sequelize.define('notificationsSent', {
  rule_id: {
    type: Sequelize.SMALLINT.UNSIGNED,
    allowNull: false,
  },
  time: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName, timestamps: false, createdAt: false, updatedAt: false,
});

// eslint-disable-next-line
notificationsSent.prototype.toJSON = function () {
  return Object.assign({}, this.get());
};

module.exports = notificationsSent;
