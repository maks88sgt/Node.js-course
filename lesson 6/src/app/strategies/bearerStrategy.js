const BearerStrategy = require('passport-http-bearer');

const { authorizeUserByToken } = require('../database/authorizeUserByToken');

const bearerStrategy = new BearerStrategy(authorizeUserByToken);

module.exports = {
  bearerStrategy,
};
