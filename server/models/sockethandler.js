(function (exports) {

  "use strict";

  var io    = require('socket.io');

  function index(req, res) {
    res.render('index', { 'title': 'Backbone.js, Node.js, MongoDB Todos' });
  }

  exports.init = function (app, server) {
    io.listen(server);

    io.sockets.on('connection', function (socket) {
      app.round = game.newGame();

      io.sockets.emit('blast', {msg:"<span style=\"color:red !important\">someone connected</span>"});
      io.sockets.emit('blast', {msg:"<span style=\"color:red !important\">" + app.round.num1 + " + " + app.round.num2 + "</span>"});

      socket.on('blast', function(data, fn){
        console.log(data.msg + " ?= " + app.round.ans);
        if (parseInt(data.msg) == parseInt(app.round.ans)) {
          io.sockets.emit('blast', {msg:"<span style=\"color:red !important\">CORRECT</span>"});
        } else {
          io.sockets.emit('blast', {msg:"<span style=\"color:red !important\">Wrong</span>"});
        }
        console.log('SOCKET ID ' + socket.id);
        io.sockets.emit('blast', {msg:data.msg});

        //call the client back to clear out the field
        fn();
      });
    });
  };

}(exports));