const Sequelize = require('sequelize');

const credentials = require('./credentials');

const database = new Sequelize(
  credentials.database,
  credentials.username,
  credentials.password, {
    host: credentials.host,
    dialect: credentials.dialect,
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  },
);

module.exports = database;
