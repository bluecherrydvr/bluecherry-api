const Sequelize = require('sequelize');

const sequelize = require('../../config/database');
const EventsCam = require('./EventsCam');
const Users = require('./User');

const tableName = 'EventComments';

const EventComments = sequelize.define('EventComments', {
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
  user_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Users,
      key: 'id',
    },
  },
  comment: {
    type: Sequelize.STRING,
  },
}, { tableName });

// eslint-disable-next-line
EventComments.prototype.toJSON = function () {
  return Object.assign({}, this.get());
};

module.exports = EventComments;
