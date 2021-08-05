const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'TagNames';

const TagNames = sequelize.define('TagNames', {
  name: {
    type: Sequelize.STRING,
  },
}, { tableName });

// eslint-disable-next-line
TagNames.prototype.toJSON = function () {
  return Object.assign({}, this.get());
};

module.exports = TagNames;
