const http = require('http');
const fs = require('fs');
const url = require('url');

const port = 3000;
const dbInfo = 'authorizedUsers.json';

let authorizedUsers = [];
if (fs.existsSync(dbInfo)) {
    authorizedUsers = JSON.parse(fs.readFileSync(dbInfo, 'utf8'));
    console.log('>>> Authorized users readed from database: ', authorizedUsers);
}

const isNewUser = (userArr, user) => {
    for (let item of userArr) {
        if (item.name == user.name && item.ip == user.ip) {
            return false;
        }
    }
    return true;
};

const requestHandler = (request, response) => {
    const ip = request.connection.remoteAddress;
    const name = request.headers.name;
    const newUser = { name: name, ip: ip }
    if (
        request.method === 'POST' &&
        name &&
        request.headers.iknowyoursecret === 'TheOwlsAreNotWhatTheySeem'
    ) {
        if (authorizedUsers.length == 0 || isNewUser(authorizedUsers, newUser)) {
            authorizedUsers.push({ name: request.headers.name, ip });
            fs.writeFile(dbInfo, JSON.stringify(authorizedUsers), (err) => {
                if (err) {
                    throw err;
                }
            });
            console.log('New user added to database.');
        }

        console.log('Authorized user send me request.');
        response.end(`Hello, ${name}!`);
    }

};

const server = http.createServer(requestHandler);

server.listen(port, (error) => {
    if (error) {
        return console.log('The exeption is happened: ', error);
    }
    console.log(`Server is listening on ${port}`);
});