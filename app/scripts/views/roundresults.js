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

        initialize: function() {
            Backbone.history.navigate("results");
        },

        render: function() {
            var template = this.template({
                winner: this.options.winner,
                isCorrect: this.options.isCorrect
            });
            this.$el.html(template);
        }
    });

    return RoundresultsView;
});