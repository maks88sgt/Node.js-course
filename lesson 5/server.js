const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local');
const BearerStrategy = require('passport-http-bearer');
const bodyParser = require ('body-parser');
const jwt = require('jsonwebtoken');

const secretConfig = {
  secret: 'TheOwlsAreNotWhatTheySeem',
};

const app = express();

const port = 8080;

mongoose.connect('mongodb://localhost:27017', /*{ useNewUrlParser: true }*/);
const UserSchema = mongoose.Schema({ name: String, password: String, jwt: String });
const User = mongoose.model('Users', UserSchema);

async function readUsersFromDatabase(database) {
  return await database.find({});
}

const localStrategy = new LocalStrategy(
  { usernameField: 'username', passwordField: 'password'},
  (username, password, done) => {
    console.log(username + ' ' + password);
    User.find({ name: username, password: password }).exec().then ((foundedUsers) => {
      console.log(foundedUsers);
      if (!foundedUsers || !foundedUsers.length) {
        done('Not found');
      } else {
        console.log(username + ' try to pass into');
        done(null, foundedUsers[0]);
      }
    });
  }
);

const bearerStrategy = new BearerStrategy((token, done) => {
    User.findOne({ jwt: token }).exec().then ((foundedUser) => {
      if (!foundedUser) {
        done('Invalid token');
      } else {
        done(null, foundedUser);
      }
    });
});

app.use(bodyParser.json());

passport.use('local', localStrategy);
passport.use('bearer', bearerStrategy);

passport.serializeUser((user, done) => {
  let token = jwt.sign(
    {username: user.name},
    secretConfig.secret,
    { expiresIn: '24h'},
  );
  User.updateOne({ name: user.name }, { jwt: token }, (err, updatedUser) => {
    done (null, updatedUser);
  });
});

passport.deserializeUser((user, done) => {
  done (null, user);
});

app.use(passport.initialize());

app.post('/token', passport.authenticate('local', {
  successRedirect: '/success',
  failureRedirect: '/failure'
}));

app.get('/name', passport.authenticate('bearer', { session: false }), (request, response) => {
  console.log(`Authorized user ${request.user.name} send GET request with JWT`);
  response.send(`Hello ${request.user.name}`);
});



app.listen(port, async (error) => {
  if (error) {
    return console.log('The exception is happened: ', error);
  }
  console.log(`Server is listening on ${port}`);
  let usersFromDatabase = await readUsersFromDatabase(User);
  console.log(`In the database now ${usersFromDatabase.length} users:\n`, usersFromDatabase.map((user) => user.name + '\t\t' + user.password + '\t\t' + user.jwt).join('\n'));
});
