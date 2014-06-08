(function(exports) {

    "use strict";

    var userManager = require('./usermanager');
    var isGameInProgress = false;

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
        return {
            isGameInProgress: isGameInProgress,
            activeUsers: userManager.activeUsers
        }
    }

    exports.getuserManager = function() {
        return userManager;
    }


    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

}(exports));