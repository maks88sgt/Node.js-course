const http = require('http');

const options = {
    hostname: 'localhost',
    port: 3000,
    method: 'POST',
    headers: {
        iknowyoursecret: 'TheOwlsAreNotWhatTheySeem',
        name: 'Sergey',
    }
};

const req = http.request(options, (response) => {
    console.log(`${options.method} request sended.`)
    console.log(`Response status code is ${ response.statusCode } (${ response.statusMessage }).`);
});

req.on('error', (e) => {
    console.error(`
                    problem with request: $ { e.message }
                    `);
});

req.end();