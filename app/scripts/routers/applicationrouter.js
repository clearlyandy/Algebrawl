/*global define*/

define([
    'jquery',
    'backbone',
    'controller',
    'views/home',
    'views/game'
], function($, Backbone, Controller, HomeView, GameView) {
    'use strict';

    var ApplicationRouter = Backbone.Marionette.AppRouter.extend({
        routes: {
            "game": "game",
            "*path": "home"
        },

        initialize: function() {
            Backbone.pubSub = _.extend({}, Backbone.Events);
        },

        home: function() {
            //var view = new HomeView();
            //view.render();
        },

        game: function() {
            var view = new GameView();
            view.render();
        }

    });

    return ApplicationRouter;
});