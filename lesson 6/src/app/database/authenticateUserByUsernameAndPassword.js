const database = require('./database');
const User = database.User;

function authenticateUserByUsernameAndPassword(username, password, done) {
  User.find({ name: username, password: password }).exec().then((foundedUsers) => {
    if (!foundedUsers || !foundedUsers.length) {
      done('Invalid username or password');
    }
    else {
      done(null, foundedUsers[0]);
    }
  });
}

module.exports = {
  authenticateUserByUsernameAndPassword,
};
