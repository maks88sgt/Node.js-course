const database = require('./database');
const User = database.User;

function authorizeUserByToken(token, done) {
  User.findOne({ jwt: token }).exec().then((foundedUser) => {
    if (!foundedUser) {
      done('Invalid token');
    }
    else {
      done(null, foundedUser);
    }
  });
}

module.exports = {
  authorizeUserByToken,
};
