var server = require('./server');
var router = require('./router');
var requestHandlers = require('./requestHandlers');

// path와 연결되는 handler 함수의 정보 저장
var handle = {};
handle['/'] = requestHandlers.start;
handle['/start'] = requestHandlers.start;
handle['/hello'] = requestHandlers.hello;

server.start(router.route, handle);