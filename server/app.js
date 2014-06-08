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
    timer = null;

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

server.listen(app.get('port'));

io.sockets.on('connection', function(socket) {

    engine.getUserManager().addUser(socket.id, "Andy" + socket.id);

    socket.on('disconnect', function() {
        engine.getUserManager().removeUser(socket.id);
        if (engine.getStatus().activeUsers.length < 0)
            clearInterval(timer);
    });

    socket.on('guess', function(data) {
        var win;
        var correctAnswerId = parseInt(app.possibleAnswers[0].answerId);
        var guessedAnswerId = parseInt(data.guessId)
        if (guessedAnswerId == correctAnswerId) {
            clearInterval(timer);

            var winner = engine.getUserManager().findUserBySocketId(socket.id);
            winner.win();
            for (var userIdx in engine.getUserManager().getActivePlayers()) {
                var user = engine.getUserManager().getActivePlayers()[userIdx];
                if (user.socketId != winner.socketId) {
                    user.lose();
                }
            }

            engine.gameOver();

            io.sockets.emit('gameover', {
                winner: engine.getUserManager().findUserBySocketId(socket.id),
                win: true,
                correctAnswer: app.possibleAnswers[0],
                playerData: engine.getUserManager().getActivePlayers()
            });
        } else {
            io.sockets.emit('wrong');
        }
    });

    socket.on('newgame', function() {
        if (engine.getStatus().isGameInProgress) {
            io.sockets.emit('enterwaitingroom');
            return;
        }

        app.possibleAnswers = engine.newGame();
        io.sockets.emit('startgame', {
            possibleAnswers: app.possibleAnswers
        });

        var gameTime, roundDuration;
        gameTime = roundDuration = 15000;

        // Send time every second
        timer = setInterval(function() {
            io.sockets.emit('updategametimer', {
                timeElapsed: gameTime,
                roundDuration: roundDuration
            });
            if (gameTime == 0) {
                clearInterval(timer);
                for (var userIdx in engine.getUserManager().getActivePlayers()) {
                    var user = engine.getUserManager().getActivePlayers()[userIdx];
                    user.lose();
                }
                engine.gameOver();
                io.sockets.emit('gameover', {
                    win: false,
                    correctAnswer: app.possibleAnswers[0],
                    playerData: engine.getUserManager().getActivePlayers()
                    //winner: engine.getWinnerName(),
                    //standings: engine.getStandings()
                });
            }
            gameTime = gameTime - 1000;

        }, 1000);
    });
});