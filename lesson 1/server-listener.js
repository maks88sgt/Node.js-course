const http = require('http');

http.createServer(function(request, response) {

    response.end('You send request for my first server.');
    console.log('My first server is available')
}).listen(3000);