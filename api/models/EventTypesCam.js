const sequelize = require('../../config/database');

const tableName = 'EventTypesCam';

const EventTypesCam = sequelize.define('EventTypesCam', {
}, {
  tableName, timestamps: false, createdAt: false, updatedAt: false,
});

// eslint-disable-next-line
EventTypesCam.prototype.toJSON = function () {
  return Object.assign({}, this.get());
};

module.exports = EventTypesCam;
