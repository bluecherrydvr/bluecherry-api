const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'Media';

const Media = sequelize.define('Media', {
  start: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  end: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  size: {
    type: Sequelize.INTEGER,
  },
  device_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  filepath: {
    type: Sequelize.STRING(1024),
    allowNull: false,
  },
  archive: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
}, { tableName });

// eslint-disable-next-line
Media.prototype.toJSON = function () {
  return Object.assign({}, this.get());
};

module.exports = Media;
