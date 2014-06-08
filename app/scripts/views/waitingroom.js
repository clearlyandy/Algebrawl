/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'hbs!tmpl/waitingroom'
], function($, _, Backbone, WaitingRoomTemplate) {
    'use strict';

    var WaitingRoomView = Backbone.View.extend({
        el: $("#page"),
        template: WaitingRoomTemplate,

        // Render the view that the user will see
        // until the game in progress ends.
        render: function() {
            this.$el.html(this.template());
        },
    });

    return WaitingRoomView;
});