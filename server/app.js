'use strict';

var express = require('express'),
    app = express(),
    http = require('http'),
    path = require('path'),
    async = require('async'),
    hbs = require('express-hbs'),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    /*device = require('express-device'),*/
    game = require('./models/game.js');


app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('view engine', 'handlebars');
    app.set('views', __dirname + '../app/scripts/views');
    app.use(express.static(path.join(__dirname, '../app')));
    app.use(express.static(path.join(__dirname, '../.tmp')));

    // set logging
    app.use(function(req, res, next) {
        console.log('%s %s', req.method, req.url);
        next();
    });
});

// route index.html
app.get('/', function(req, res) {
    res.sendfile(path.join(__dirname, '../app/index.html'));
});

// start server
server.listen(app.get('port'));

io.sockets.on('connection', function(socket) {
    app.possibleAnswers = game.newGame();

    io.sockets.emit('message', {
        msg: "<span style=\"color:red !important\">someone connected</span>"
    });
    io.sockets.emit('message', {
        msg: "<span style=\"color:red !important\">" + app.possibleAnswers[0].num1 + " + " + app.possibleAnswers[0].num2 + "</span>"
    });

    socket.on('guess', function(data, fn) {
        if (parseInt(data.msg) == parseInt(app.possibleAnswers[0].ans)) {
            io.sockets.emit('message', {
                msg: "<span style=\"color:red !important\">CORRECT</span>"
            });
        } else {
            io.sockets.emit('message', {
                msg: "<span style=\"color:red !important\">Wrong</span>"
            });
        }
        console.log('SOCKET ID ' + socket.id);
        io.sockets.emit('message', {
            msg: data.msg
        });

        //call the client back to clear out the field
        fn();
    });

    socket.on('newgame', function(fn) {
        app.possibleAnswers = game.newGame();
        fn(app.possibleAnswers);
    });

});