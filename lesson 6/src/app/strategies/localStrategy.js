const LocalStrategy = require('passport-local');

const { authenticateUserByUsernameAndPassword } = require('../database/authenticateUserByUsernameAndPassword');

const localStrategy = new LocalStrategy(
  { usernameField: 'username', passwordField: 'password' },
  authenticateUserByUsernameAndPassword,
);

module.exports = {
  localStrategy,
};
