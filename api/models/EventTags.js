const Sequelize = require('sequelize');

const sequelize = require('../../config/database');
const EventsCam = require('./EventsCam');
const Users = require('./User');

const tableName = 'EventTags';

const EventTags = sequelize.define('EventTags', {
  time: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  event_id: {
    type: Sequelize.INTEGER,
    references: {
      model: EventsCam,
      key: 'id',
    },
  },
  tag_id: {
    type: Sequelize.STRING(10),
  },
  user_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Users,
      key: 'id',
    },
  },
}, { tableName });

// eslint-disable-next-line
EventTags.prototype.toJSON = function () {
  return Object.assign({}, this.get());
};

module.exports = EventTags;
