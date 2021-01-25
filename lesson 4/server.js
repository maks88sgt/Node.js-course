const express = require('express');
const mongoose = require('mongoose');

const app = express();

const port = 8080;

mongoose.connect('mongodb://localhost:27017');
const UserSchema = mongoose.Schema({ name: String, ip: String });
const User = mongoose.model('Users', UserSchema);

async function readUsersFromDatabase(database) {
  return await database.find({});
}

app.use((request, response, next) => {
  if (request.url === '/favicon.ico') {
    return;
  }
  if (request.method !== 'POST') {
    console.log('Somebody send me wrong request');
    return response.send('Your request method is wrong!!!');
  }
  next();
});

app.use((request, response, next) => {
  if (!request.headers.name && !request.headers.iknowyoursecret === 'TheOwlsAreNotWhatTheySeem') {
    return response.send('Bye. You don\'t know the secret.');
  }
  next();
});

app.use(async (request, response, next) => {
    const usersFromDatabase = await readUsersFromDatabase(User);
    const ip = request.connection.remoteAddress;
    const name = request.headers.name;
    const newUser = new User({ name: name, ip: ip });
    if (usersFromDatabase.length === 0 || isNewUser(usersFromDatabase, newUser)) {
      console.log(newUser);
      newUser.save((err, savedUser) => {
        if (err) {
          throw err;
        }
      });
    }
    next();
  }
)
;

app.use((request, response) => {
  response.send(`Hello, ${request.headers.name}!`);
  console.log(`Hello, ${request.headers.name}!`);
});

app.listen(port, async (error) => {
  if (error) {
    return console.log('The exception is happened: ', error);
  }
  console.log(`Server is listening on ${port}`);
  let usersFromDatabase = await readUsersFromDatabase(User);
  console.log(`In the database now ${usersFromDatabase.length} users:`, usersFromDatabase.map((user) => user.name).join(' '));
});
