(function(exports) {

    "use strict";

    var userManager = require('./usermanager'),
        isGameInProgress = false,
        timer = null;

    function index(req, res) {
        res.render('index', {});
    }

    exports.newGame = function() {
        isGameInProgress = true;

        var possibleAnswers = [];
        var idx = 1;
        while (idx <= 4) {
            var answer = {};
            answer.num1 = getRandomInt(1, 10)
            answer.num2 = getRandomInt(1, 10);
            answer.answerId = idx;
            answer.ans = answer.num1 + answer.num2;

            var exists = false;
            for (var a in possibleAnswers) {
                if (possibleAnswers[a].ans == answer.ans) {
                    exists = true;
                }
            }
            if (!exists) {
                possibleAnswers.push(answer);
                idx++;
            }
        }
        return possibleAnswers;
    };

    exports.gameOver = function() {
        isGameInProgress = false;
    }

    exports.getStatus = function() {
        if (userManager.getActiveUsers().length < 1)
            isGameInProgress = false;
        return {
            isGameInProgress: isGameInProgress,
            activeUsers: userManager.getActiveUsers()
        }
    }

    exports.getUserManager = function() {
        return userManager;
    }

    exports.setSocketConnection = function(socket, iosockets) {
        var engine = this;
        engine.getUserManager().addUser(socket.id, "Andy" + socket.id);

        socket.on('disconnect', function() {
            engine.getUserManager().removeUser(socket.id);
            if (engine.getStatus().activeUsers.length < 0)
                clearInterval(timer);
        });

        socket.on('guess', function(data) {
            var win;
            var correctAnswerId = parseInt(engine.possibleAnswers[0].answerId);
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

                iosockets.emit('gameover', {
                    winner: engine.getUserManager().findUserBySocketId(socket.id),
                    win: true,
                    correctAnswer: engine.possibleAnswers[0],
                    playerData: engine.getUserManager().getActivePlayers()
                });
            } else {
                iosockets.emit('wrong');
            }
        });

        socket.on('newgame', function() {
            if (engine.getStatus().isGameInProgress) {
                iosockets.emit('enterwaitingroom');
                return;
            }

            engine.possibleAnswers = engine.newGame();
            iosockets.emit('startgame', {
                possibleAnswers: engine.possibleAnswers
            });

            var gameTime, roundDuration;
            gameTime = roundDuration = 15000;

            // Send time every second
            timer = setInterval(function() {
                iosockets.emit('updategametimer', {
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
                    iosockets.emit('gameover', {
                        win: false,
                        correctAnswer: engine.possibleAnswers[0],
                        playerData: engine.getUserManager().getActivePlayers()
                        //winner: engine.getWinnerName(),
                        //standings: engine.getStandings()
                    });
                }
                gameTime = gameTime - 1000;

            }, 1000);
        });
    }


    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

}(exports));