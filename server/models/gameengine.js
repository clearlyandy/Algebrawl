(function(exports) {

    "use strict";

    var user = require('./user');
    var isGameInProgress = false;
    var activeUsers = [];

    function index(req, res) {
        res.render('index', {
            'title': 'Backbone.js, Node.js, MongoDB Todos'
        });
    }

    exports.newGame = function() {
        isGameInProgress = true;

        var possibleAnswers = [];

        var idx = 1;
        while (idx <= 4) {
            var answer = {};
            answer.num1 = getRandomInt(1, 10)
            answer.num2 = getRandomInt(1, 10);
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
    };

    exports.addUser = function(socketId, name) {
        if (findUserBySocketId(socketId) != null)
            return;
        var newUser = user.createUser(socketId, activeUsers.length, name)
        activeUsers.push(newUser);
        console.log("User connected: " + newUser);
    };

    exports.removeUser = function(socketId) {
        var user = findUserBySocketId(socketId);
        if (user == null)
            return;

        console.log("User disconnected: " + user);
        removeUserBySocketId(socketId);
        if (activeUsers.length < 1)
            isGameInProgress = false;
    };

    exports.getStatus = function() {
        return {
            isGameInProgress: isGameInProgress,
            activeUsers: activeUsers
        }
    }

    function findUserBySocketId(socketId) {
        var user = null;
        for (var i = 0; i < activeUsers.length; i++) {
            if (activeUsers[i].socketId == socketId) {
                return activeUsers[i];
            }
        }
        return null;
    }

    function removeUserBySocketId(socketId) {
        var user = null;
        for (var i = 0; i < activeUsers.length; i++) {
            if (activeUsers[i].socketId == socketId) {
                activeUsers.splice(i, 1);
            }
        }
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

}(exports));