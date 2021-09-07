const connection = require('./connection');

let credentials;

switch (process.env.NODE_ENV) {
  case 'production':
    credentials = connection.production;
    break;
  case 'testing':
    credentials = connection.testing;
    break;
  default:
    credentials = connection.development;
}
module.exports = credentials;
