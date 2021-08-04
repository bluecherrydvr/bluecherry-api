const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'AvailableSources';

const AvailableSources = sequelize.define('AvailableSources', {
  device: {
    type: Sequelize.STRING,
    unique: true,
  },
  driver: {
    type: Sequelize.STRING,
  },
  card_id: {
    type: Sequelize.STRING,
  },
  video_type: {
    type: Sequelize.STRING,
  },
}, { tableName });

// eslint-disable-next-line
AvailableSources.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  delete values.password;

  return values;
};

module.exports = AvailableSources;
