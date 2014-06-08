/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'hbs!tmpl/game',
    'models/answer',
    'views/answerset',
    'views/roundresults',
    'views/waitingroom',
    'animo',
    'textfill',
], function($, _, Backbone, GameTemplate, AnswerModel, AnswersetView, RoundResultsView, WaitingRoomView) {
    'use strict';

    var GameView = Backbone.View.extend({
        el: $("#page"),
        answers: null,
        winningAnswer: null,
        currentItem: null,
        selectedAnswer: null,
        template: GameTemplate,

        events: {
            "click .btn-choice": "guess"
        },

        render: function() {
            this.initializeGame();
        },

        initializeGame: function() {
            var self = this;

            // Tell the server that a new user has joined
            Backbone.socket.emit("newgame");

            // Listen for game engine events from the server
            Backbone.socket.on("startgame", function(data) {
                self.answers = data.possibleAnswers;
                self.startRound();
            });
            Backbone.socket.on("enterwaitingroom", function() {
                self.enterWaitingRoom();
            });
            Backbone.socket.on("updategametimer", function(data) {
                self.timerTrigger(data);
            });
            Backbone.socket.on("gameover", function(data) {
                self.gameOver(data);
            });
            Backbone.socket.on("wrong", function() {
                self.wrongGuess();
            });
        },

        startRound: function() {
            // Animate in the timer display
            $(".stats").show().animo({
                animation: 'bounceIn'
            });
            $("#timer").css("color", "#000");

            // Set the winner
            this.winningAnswer = this.answers[0];

            // Render the hint and choice templates
            var template = this.template();
            this.$el.html(template);
            var view = new AnswersetView({
                choices: this.answers
            });
            view.setElement("#choice-holder").render();
        },

        getRandomInt: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        timerTrigger: function(data) {
            var self = this;

            // Animate in the equation
            if (data.timeElapsed == data.roundDuration) {
                // Set up the element that will hold the equation
                var hint = self.winningAnswer.num1 + " + " + self.winningAnswer.num2;
                var item = $("<div class='ingredient-hint'><span>" + hint + "</span></div>");
                $("#ingredients").append(item);
                $('.ingredient-hint').textfill({
                    maxFontPixels: 36
                });

                // Animate the equation text in and make it wiggle
                // throughout the round
                var tada = function() {
                    $(item).animo({
                        animation: 'tada'
                    }, function() {
                        setTimeout(tada, 500);
                    });
                    self.currentItem = item;
                }
                $(item).animo({
                    animation: 'bounceInRight'
                }, tada);
            }

            // Update the timer display
            var te = self.pad((data.timeElapsed / 10).toString(), 4);
            var time = te.substr(0, 2) + ":" + te.substr(2, 4);
            $("#timer").html(time);
            if (data.timeElapsed < 5000) {
                $("#timer").css("color", "red");
            }
        },

        gameOver: function(data) {
            // Render the end-of-round results view
            this.undelegateEvents();
            var view = new RoundResultsView(data);
            view.render();
        },

        guess: function(e) {
            // Tell the server what the user guessed
            this.selectedAnswer = $(e.target);
            Backbone.socket.emit("guess", {
                guessId: $(e.target).attr("rel")
            });
        },

        wrongGuess: function() {
            // Highlight the answer the user clicked
            // and hide all others.
            var self = this;
            _.each($(".btn-choice"), function(btn) {
                if (self.selectedAnswer.attr("rel") != $(btn).attr("rel")) {
                    $(btn).fadeTo("slow", 0);
                } else {
                    $(btn).css("background-color", "red");
                }
            });
        },

        enterWaitingRoom: function() {
            // Render the view that is displayed while
            // a round is in progress.
            var view = new WaitingRoomView();
            view.render();
        },

        pad: function(n, width, z) {
            // Used to pad the timer display with leading zeroes.
            z = z || '0';
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        }
    });

    return GameView;
});