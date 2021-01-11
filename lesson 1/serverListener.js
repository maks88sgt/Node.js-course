const http = require('http');

http.createServer(function(request, response) {

    if (request.headers.question) {
        console.log(`Somebody send me ${request.method} request, with question :'${request.headers.question}'`);
        if (request.headers.question == 'What will save the world?') {
            console.log(`I want answer: 'Love'`);
            response.headersSent = 'Love'
            response.end(`My answer was ${response.headersSent}`);
        }
    } else {
        console.log(`Somebody send me ${request.method} request`);
        response.end(`You send ${request.method} request for my first server.`);
    }

}).listen(3000);