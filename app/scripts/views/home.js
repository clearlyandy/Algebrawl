/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'hbs!tmpl/game'
], function($, _, Backbone, GameTemplate) {
    'use strict';

    var HomeView = Backbone.View.extend({
        el: $("#page"),
        template: GameTemplate,

        initialize: function() {
            Backbone.socket.emit("newgame",
                function(data) {
                    console.log(data);
                });
        },

        render: function() {
            this.$el.html(this.template);
        },
    });

    return HomeView;
});