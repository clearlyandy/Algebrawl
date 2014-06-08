require([
        'backbone',
        'application',
        'regionManager',
        'routers/applicationrouter'
    ],
    function(Backbone, App, RegionManager, Router) {
        'use strict';

        Backbone.socket = io.connect('http://localhost:9000/');
        App.start();
        new Router();
        Backbone.history.start();
    });