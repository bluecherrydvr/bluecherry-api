const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'Storage';

const Storage = sequelize.define('Storage', {
  priority: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  path: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  max_thresh: {
    type: Sequelize.DECIMAL(5, 2),
    allowNull: false,
  },
  min_thresh: {
    type: Sequelize.DECIMAL(5, 2),
    allowNull: false,
  },
}, {
  tableName, timestamps: false, createdAt: false, updatedAt: false,
});

// eslint-disable-next-line
Storage.prototype.toJSON = function () {
  return Object.assign({}, this.get());
};

module.exports = Storage;
