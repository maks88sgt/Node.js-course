const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local');
const BearerStrategy = require('passport-http-bearer');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const secretConfig = {
  secret: 'TheOwlsAreNotWhatTheySeem',
};

const app = express();

const port = 8080;

mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true ,  useUnifiedTopology: true });
const UserSchema = mongoose.Schema({ name: String, password: String, jwt: String });
const User = mongoose.model('Users', UserSchema);

const localStrategy = new LocalStrategy(
  { usernameField: 'username', passwordField: 'password' },
  (username, password, done) => {
    User.find({ name: username, password: password }).exec().then((foundedUsers) => {
      if (!foundedUsers || !foundedUsers.length) {
        done('Invalid username or password');
      }
      else {
        done(null, foundedUsers[0]);
      }
    });
  }
);

const bearerStrategy = new BearerStrategy((token, done) => {
  User.findOne({ jwt: token }).exec().then((foundedUser) => {
    if (!foundedUser) {
      done('Invalid token');
    }
    else {
      done(null, foundedUser);
    }
  });
});

passport.use('local', localStrategy);
passport.use('bearer', bearerStrategy);

passport.serializeUser((user, done) => {
  let token = jwt.sign(
    { username: user.name },
    secretConfig.secret,
    { expiresIn: '24h' },
  );
  User.updateOne({ name: user.name }, { jwt: token }, (err, updatedUser) => {
    done(null, updatedUser);
  });
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(bodyParser.json());

app.use(passport.initialize());

app.post('/token', passport.authenticate('local', {
  successRedirect: '/success',
  failureRedirect: '/failure'
}));

app.get('/name', passport.authenticate('bearer', { session: false }), (request, response) => {
  console.log(`Authorized user ${request.user.name} send GET request with JWT`);
  response.send(`Hello ${request.user.name}`);
});


app.listen(port, (error) => {
  if (error) {
    return console.log('The exception is happened: ', error);
  }
  console.log(`Server is listening on ${port}`);
  User.find({})
    .exec()
    .then((usersFromDatabase) => {
      console.log(`In the database now ${usersFromDatabase.length} users:\n`, usersFromDatabase.map((user) => user.name + '\t\t' + user.password + '\t\t' + user.jwt).join('\n'))
    });
});
