const jwt = require('jsonwebtoken');

const database = require('../database/database');
const User = database.User;
const { secret, tokenValidity } = require('../../config/config');

async function generateJWT(user, done) {
  let token = jwt.sign(
    { username: user.name },
    secret,
    { expiresIn: tokenValidity },
  );
  User.updateOne({ name: user.name }, { jwt: token }).exec().then((updatedUser) => {
    done(null, updatedUser);
  });
}

module.exports = {
  generateJWT,
};
