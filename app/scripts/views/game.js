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
        timer: null,
        gameTime: 1500,
        timeElapsed: null,
        answers: null,
        winningAnswer: null,
        currentItem: null,
        nextItem: null,
        template: GameTemplate,

        events: {
            "click .btn-choice": "onGuess"
        },

        initialize: function() {
            if (typeof Backbone.score == "undefined")
                Backbone.score = 0;
        },

        render: function() {
            this.initializeGame();
        },

        initializeGame: function() {
            var self = this;
            Backbone.socket.emit("newgame");
            Backbone.socket.on("startgame", function(data) {
                self.answers = data.possibleAnswers;
                self.startRound();
            });
            Backbone.socket.on("enterwaitingroom", function() {
                console.log("enterwaitingroom");
                self.enterWaitingRoom();
            });
            Backbone.socket.on("updategametimer", function(data) {
                console.log("updatinggametimer");
                self.onGameTimer(data);
            });
        },

        startRound: function() {
            $(".btn-play").hide();
            $(".stats").show();
            $("#timer").css("color", "#000");

            // Set the winner
            var winnerIdx = this.getRandomInt(0, 3);
            this.winningAnswer = this.answers[0];
            //this.gameTime = this.timeElapsed = 1500;

            //this.timer = window.setInterval(this.onGameTimer, 10, this);

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

        onGameTimer: function(data) {
            var self = this;
            var hintInterval = self.gameTime;
            self.timeElapsed = data.time / 10;
            console.log(self.timeElapsed + " " + self.gameTime);

            if (self.timeElapsed == self.gameTime) {
                var idx = Math.ceil((self.gameTime - self.timeElapsed) / hintInterval);

                var hint = self.winningAnswer.num1 + " + " + self.winningAnswer.num2;

                var item = $("<div class='ingredient-hint'><span>" + hint + "</span></div>");
                $("#ingredients").append(item);
                $('.ingredient-hint').textfill({
                    maxFontPixels: 36
                });

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

            var te = self.pad(self.timeElapsed.toString(), 4);
            var time = te.substr(0, 2) + ":" + te.substr(2, 4);
            $("#timer").html(time);
            if (self.timeElapsed < 500) {
                $("#timer").css("color", "red");
            }
            if (self.timeElapsed == 0) {
                if (self.currentItem != null) {
                    self.endTimer();
                    $(self.currentItem).animo({
                        animation: 'bounceOutLeft'
                    }, function(e) {
                        $(e.element).remove();
                        self.gameOver(false);
                    });
                }
            }
        },

        endTimer: function() {
            this.undelegateEvents();
            clearInterval(this.timer);
        },

        gameOver: function(isCorrect) {
            this.endTimer();
            $("#score").html(Backbone.score);

            var view = new RoundResultsView({
                winner: this.winningAnswer,
                isCorrect: isCorrect
            });
            view.render();

            $("#recipe-name").append("<b>" + this.winningAnswer.recipeName + "</b>");
            $("#btn-play").show();
        },

        onGuess: function(e) {
            console.log(Backbone.score);
            if ("guess-btn-" + this.winningAnswer.answer_id == e.target.id) {
                Backbone.score += this.timeElapsed;
                this.gameOver(true);
            } else {
                Backbone.score -= this.timeElapsed;
                this.gameOver(false);
            }
        },

        enterWaitingRoom: function() {
            var view = new WaitingRoomView();
            view.render();
        },

        pad: function(n, width, z) {
            z = z || '0';
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        },

        toTitleCase: function(str) {
            return str.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
    });

    return GameView;
});