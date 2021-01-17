const fs = require('fs');
const express = require('express')

const app = express();

const port = 3000;
const dbInfo = 'authorizedUsers.json';

let authorizedUsers = [];
if (fs.existsSync(dbInfo)) {
  authorizedUsers = JSON.parse(fs.readFileSync(dbInfo, 'utf8'));
  console.log('>>> Authorized users was readed from database: ', authorizedUsers);
}

const isNewUser = (userArr, user) => {
  for (let item of userArr) {
    if (item.name === user.name && item.ip === user.ip) {
      return false;
    }
  }
  return true;
};

app.use((request, response, next) => {
  console.log('Some request received, and middlewares are started:');
  console.log('1. >>>Right now, received request handling by first middleware');
  if (request.url === '/favicon.ico') {
    return;
  }
  if (request.method !== 'POST') {
    console.log('Somebody send me wrong request');
    return response.send('Your request method is wrong!!!');
  }
  console.log('______Request type is correct. Go to the next middleware');
  return next();
});

app.use((request, response, next) =>{
  console.log('2. >>>Second middleware entered in the stage');
  if (request.headers.name && request.headers.iknowyoursecret === 'TheOwlsAreNotWhatTheySeem') {
    console.log("______The request was sended by user, who know the secret. Let\'s see, what we know about this user.");
    return next();
  }
  console.log('______It\'s look like he doesn\'t know the secret.');
  return response.send('Bye. You don\'t know the secret.');
});

app.use((request,response,next)=>{
  console.log('3. >>>The third middleware made its contribution');
  const ip = request.connection.remoteAddress;
  const name = request.headers.name;
  const newUser = { name: name, ip: ip };
  if (authorizedUsers.length === 0 || isNewUser(authorizedUsers, newUser)) {
    authorizedUsers.push(newUser);
    fs.writeFile(dbInfo, JSON.stringify(authorizedUsers), (err) => {
      if (err) {
        throw err;
      }
    });
    console.log('______It\'s first time, when we met this user. We add him to database.');
    return next();
  }
  console.log('______Oh, our old friend remember about us.');
  return next();
});

app.use((request,response)=>{
  console.log('4. >>>The fourth middleware is completed the chain');
  console.log(`______It is ${request.headers.name}, and we welcome him!`);
  return response.send(`Hello, ${request.headers.name}!`);
});

app.listen(port, (error) => {
  if (error) {
    return console.log('The exception is happened: ', error);
  }
  console.log(`Server is listening on ${port}`);
});
