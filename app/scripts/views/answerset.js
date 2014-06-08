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

        initialize: function() {

        },

        render: function() {
            var template = this.template({
                choices: this.options.choices
            });

            this.$el.html(template);
        },
    });

    return AnswersetView;
});