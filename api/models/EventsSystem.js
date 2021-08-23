const Sequelize = require('sequelize');

const sequelize = require('../../config/database');
const EventLevels = require('./EventLevels');
const EventTypesSys = require('./EventTypesSys');

const tableName = 'EventsSystem';


const EventsSystem = sequelize.define('EventsSystem', {
  time: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  level_id: {
    type: Sequelize.STRING(10),
    references: {
      model: EventLevels,
      key: 'id',
    },
  },
  type_id: {
    type: Sequelize.STRING(10),
    references: {
      model: EventTypesSys,
      key: 'id',
    },
  },
  more: {
    type: Sequelize.STRING(64),
    defaultValue: 0,
  },
  details: {
    type: Sequelize.TEXT,
  },
}, {
  tableName, timestamps: false, createdAt: false, updatedAt: false,
});

// eslint-disable-next-line
EventsSystem.prototype.toJSON = function () {
  return Object.assign({}, this.get());
};

module.exports = EventsSystem;
