const { Console } = require('console');
const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
};

http.get(options, (response) => {
    console.log(`${options.method} request sended.`);
    const { statusCode } = response;
    console.log(`Response status code is ${statusCode} (${response.statusMessage}).`);

});