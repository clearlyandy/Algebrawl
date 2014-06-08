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

        render: function() {
            this.$el.html(this.template());
        },
    });

    return WaitingRoomView;
});