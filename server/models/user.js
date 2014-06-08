(function(exports) {

    "use strict";

    var User = {
        socketId: null,
        playerId: null,
        name: "",
        wins: 0,
        losses: 0,
        win: function() {
            this.wins++;
        },
        lose: function() {
            this.losses++;
        },
        toString: function() {
            return this.socketId + " // " + this.playerId + " // " + this.name + " // " + this.wins + " // " + this.losses;
        }
    }

    exports.createUser = function(sId, pId, n) {
        return Object.create(User, {
            socketId: {
                value: sId
            },
            playerId: {
                value: pId
            },
            name: {
                value: n
            }
        });
    }

}(exports));