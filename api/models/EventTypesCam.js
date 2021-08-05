const sequelize = require('../../config/database');

const tableName = 'EventTypesCam';

const EventTypesCam = sequelize.define('EventTypesCam', {
}, { tableName });

// eslint-disable-next-line
EventTypesCam.prototype.toJSON = function () {
  return Object.assign({}, this.get());
};

module.exports = EventTypesCam;
