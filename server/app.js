'use strict';

var express = require('express'),
    app = express(),
    http = require('http'),
    path = require('path'),
    async = require('async'),
    hbs = require('express-hbs'),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    engine = require('./models/gameengine.js'),
    timer = null,
    gameTime = null;


app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('view engine', 'handlebars');
    app.set('views', __dirname + '../app/scripts/views');
    app.use(express.static(path.join(__dirname, '../app')));
    app.use(express.static(path.join(__dirname, '../.tmp')));

    // set logging
    app.use(function(req, res, next) {
        //console.log('%s %s', req.method, req.url);
        next();
    });
});

app.get('/', function(req, res) {
    res.sendfile(path.join(__dirname, '../app/index.html'));
});

// start server
server.listen(app.get('port'));

io.sockets.on('connection', function(socket) {
    engine.getUserManager().addUser(socket.id, "Andy" + socket.id);
    socket.on('disconnect', function() {
        engine.getUserManager().removeUser(socket.id);
        if (engine.getStatus().activeUsers.length < 0)
            clearInterval(timer);
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
        if (engine.getStatus().isGameInProgress) {
            io.sockets.emit('enterwaitingroom');
            return;
        }

        app.possibleAnswers = engine.newGame();
        io.sockets.emit('startgame', {
            possibleAnswers: app.possibleAnswers
        });

        gameTime = 15000;

        // Send time every second
        timer = setInterval(function() {
            io.sockets.emit('updategametimer', {
                time: gameTime
            });
            if (gameTime == 0) {
                clearInterval(timer);
                io.sockets.emit('gameover', {
                    correctAnswer: app.possibleAnswers[0],
                    //winner: engine.getWinnerName(),
                    //standings: engine.getStandings()
                });
            }
            gameTime = gameTime - 1000;

        }, 1000);
    });
});