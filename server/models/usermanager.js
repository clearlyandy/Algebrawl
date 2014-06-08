(function(exports) {

    "use strict";

    var user = require('./user');
    var activeUsers = [];

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

}(exports));