function start(){
    console.log('Request handler \'start\' was called.');
    return 'Hello Start';
}

function hello(){
    console.log('Request handler \'hello\' was called.');
    return 'Hello Hello';
}

exports.start = start;
exports.hello = hello;