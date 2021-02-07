const database = require('./database');
const User = database.User;

async function getUsersFromDatabase() {
  let usersFromDatabase = await User.find({}).exec();
  return usersFromDatabase;
}

module.exports = {
  getUsersFromDatabase,
};
