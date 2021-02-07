const mongoose = require('mongoose');
const { dbPath } = require('../../config/config');

mongoose.connect(dbPath, { useNewUrlParser: true, useUnifiedTopology: true });
const UserSchema = mongoose.Schema({ name: String, password: String, jwt: String });
const User = mongoose.model('Users', UserSchema);

module.exports = {
  User,
};
