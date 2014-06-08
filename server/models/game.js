(function (exports) {

  "use strict";

  //var mongoose = require('mongoose')

  function index(req, res) {
    res.render('index', { 'title': 'Backbone.js, Node.js, MongoDB Todos' });
  }

  exports.newGame = function () {
    var possibleAnswers = [];

    for (var idx = 0; idx < 4; idx++) {
      var answer = {};
      answer.num1 = getRandomInt(1, 10)
      answer.num2 = getRandomInt(1, 10);
      answer.ans = answer.num1 + answer.num2;
      possibleAnswers.push(answer);
    }

    return possibleAnswers;
  };

  function getRandomInt(min, max) {
  	return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}(exports));