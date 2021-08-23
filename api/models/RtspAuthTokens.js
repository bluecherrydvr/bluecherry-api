const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'RtspAuthTokens';

const RtspAuthTokens = sequelize.define('RtspAuthTokens', {
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  token: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false,
  },
}, {
  tableName, timestamps: false, createdAt: false, updatedAt: false,
});

// eslint-disable-next-line
RtspAuthTokens.prototype.toJSON = function () {
  return Object.assign({}, this.get());
};

module.exports = RtspAuthTokens;
