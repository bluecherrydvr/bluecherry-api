const sequelize = require('../../config/database');

const tableName = 'EventTypesSys';

const EventTypesSys = sequelize.define('EventTypesSys', {
}, {
  tableName, timestamps: false, createdAt: false, updatedAt: false,
});

// eslint-disable-next-line
EventTypesSys.prototype.toJSON = function () {
  return Object.assign({}, this.get());
};

module.exports = EventTypesSys;
