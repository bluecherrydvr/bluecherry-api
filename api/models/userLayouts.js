const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'userLayouts';

const userLayouts = sequelize.define('userLayouts', {
  user_id: {
    type: Sequelize.INTEGER,
  },
  layout_name: {
    type: Sequelize.STRING(50),
  },
  layout: {
    type: Sequelize.STRING(255),
  },
}, { tableName });

// eslint-disable-next-line
userLayouts.prototype.toJSON = function () {
  return Object.assign({}, this.get());
};

module.exports = userLayouts;
