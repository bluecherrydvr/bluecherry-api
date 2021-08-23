const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'TagNames';

const TagNames = sequelize.define('TagNames', {
  name: {
    type: Sequelize.STRING,
  },
}, {
  tableName, timestamps: false, createdAt: false, updatedAt: false,
});

// eslint-disable-next-line
TagNames.prototype.toJSON = function () {
  return Object.assign({}, this.get());
};

module.exports = TagNames;
