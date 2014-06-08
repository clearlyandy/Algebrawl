/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'hbs!tmpl/roundresults'
], function($, _, Backbone, RoundResultsTemplate) {
    'use strict';

    var RoundresultsView = Backbone.View.extend({
        el: $("#page"),
        template: RoundResultsTemplate,

        // Renders the round results view
        // Displays the answer, the winner, and the scoreboard.
        render: function() {
            var template = this.template({
                win: this.options.win,
                correctAnswer: this.options.correctAnswer,
                playerData: this.options.playerData
            });
            this.$el.html(template);
        }
    });

    return RoundresultsView;
});