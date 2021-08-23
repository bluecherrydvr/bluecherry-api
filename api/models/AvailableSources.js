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
    allowNull: false,
  },
  video_type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, {
  tableName, timestamps: false, createdAt: false, updatedAt: false,
});

// eslint-disable-next-line
AvailableSources.prototype.toJSON = function () {
  return Object.assign({}, this.get());
};

module.exports = AvailableSources;
