var http = require('http');
var url = require('url');

var start = function start(route, handle){
    function onRequest(request, response) { 
        let pathName = url.parse(request.url).pathname;
        
        console.log('Request for '+ pathName + ' received.');
        route(pathName);
        

        response.writeHead(200, {
            'Content-Type' : 'text/plain'
        });
        response.write('Hello Node!');
        response.end();
    };
    
    http.createServer(onRequest).listen(8080);
    console.log('Server has started!');
}

exports.start = start;