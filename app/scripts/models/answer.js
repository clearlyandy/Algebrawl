/*global define*/

define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    'use strict';

    var AnswerModel = Backbone.Model.extend({
        defaults: {}
    });

    return AnswerModel;
});