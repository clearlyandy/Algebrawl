(function(exports) {

    "use strict";

    var User = {
        socketId: null,
        playerId: null,
        name: "",
        wins: 0,
        losses: 0,
        win: function() {
            this.wins = this.wins + 1;
        },
        lose: function() {
            this.losses = this.losses + 1;
        },
        toString: function() {
            return this.socketId + " // " + this.playerId + " // " + this.name + " // " + this.wins + " // " + this.losses;
        }
    }

    exports.createUser = function(sId, pId, n) {
        return Object.create(User, {
            socketId: {
                value: sId,
                enumerable: true
            },
            playerId: {
                value: pId
            },
            name: {
                value: n,
                enumerable: true
            },
            wins: {
                value: 0,
                enumerable: true,
                writable: true
            },
            losses: {
                value: 0,
                enumerable: true,
                writable: true
            }
        });
    }

}(exports));