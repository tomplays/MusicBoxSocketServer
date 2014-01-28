'use strict';
/*
Sockets.io server
./ minimal 
./ basic
./ standalone
*/



var app_package = require('./package.json'),
nconf  = require('nconf');
nconf.argv().env().file({file:'config.json'});

var io     = require('socket.io').listen(nconf.get('PORT'), { 
                                                                log: false 
                                                            });

var users= 0;

console.log('~:~:~~: Init socket.io @ '+nconf.get("SERVER_URL")+':'+nconf.get("PORT"));

io.sockets.on('connection', function (socket) {


        var address = socket.handshake.address;
        console.log('~:~:~~: Handshake by remote client (' + address.address + ":" + address.port)+' )';

        if(users<1){
                users=1;
        }
        users++;
	// act as relay
        socket.on('news', function (data) {
                console.log('~:~:~~: news event', data);
                socket.broadcast.emit('news', data);
        });
        socket.on('disconnect', function () {
                users--;
                console.log('~:~:~~: user left '+users);
                socket.broadcast.emit('users_count', users);
        });
        socket.on('user_enter', function (data) {
                users++;
                console.log('~:~:~~: new user '+users);
                socket.broadcast.emit('users_count', users);
        });
        socket.on('user', function (data) {
                console.log('~:~:~~: user action:');
                console.log(data);
                socket.broadcast.emit('user', users);
        });
});
