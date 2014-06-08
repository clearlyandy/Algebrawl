/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'hbs!tmpl/answerset'
], function($, _, Backbone, AnswerSetTemplate) {
    'use strict';

    var AnswersetView = Backbone.View.extend({
        template: AnswerSetTemplate,

        render: function() {
            // Creates the four answer choice
            // buttons.
            var template = this.template({
                choices: this.options.choices
            });
            this.$el.html(template);
        },
    });

    return AnswersetView;
});