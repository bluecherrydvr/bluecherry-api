const sequelize = require('../../config/database');

const tableName = 'EventLevels';

const EventLevels = sequelize.define('EventLevels', {
}, {
  tableName, timestamps: false, createdAt: false, updatedAt: false,
});

// eslint-disable-next-line
EventLevels.prototype.toJSON = function () {
  return Object.assign({}, this.get());
};

module.exports = EventLevels;
