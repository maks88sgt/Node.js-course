const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');

const { welcomeAuthorizedUser } = require('./utils/welcomeAuthorizedUser');
const { getUsersFromDatabase } = require('./database/getUsersFromDatabase');
const { generateJWT } = require('./utils/generateJWT');
const { bearerStrategy } = require('./strategies/bearerStrategy');
const { localStrategy } = require('./strategies/localStrategy');
const { port } = require('../config/config');

const app = express();

passport.use('local', localStrategy);
passport.use('bearer', bearerStrategy);

passport.serializeUser(generateJWT);

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(bodyParser.json());

app.use(passport.initialize());

app.post('/token', passport.authenticate('local', {
  successRedirect: '/success',
  failureRedirect: '/failure'
}));

app.get('/name', passport.authenticate('bearer', { session: false }), welcomeAuthorizedUser);


app.listen(port, async (error) => {
  if (error) {
    return console.log('The exception is happened: ', error);
  }
  console.log(`Server is listening on ${port}`);
  let usersFromDatabase = await getUsersFromDatabase();
  console.log(`In the database now ${usersFromDatabase.length} users:\n`);
  console.log(usersFromDatabase.map((user) => user.name + '\t\t' + user.password + '\t\t' + user.jwt).join('\n'));
});
