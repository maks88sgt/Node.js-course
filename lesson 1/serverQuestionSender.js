const http = require('http');

const message = 'What will save the world?'

const options = {
    hostname: 'localhost',
    port: 3000,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'question': message,
    }
};

const req = http.request(options, (res) => {
    console.log(`${options.method} request whith .`)
    console.log(`Response status: ${res.statusCode}`);
    console.log(res);
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.end();