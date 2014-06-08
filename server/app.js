'use strict';

var express = require('express'),
    app = express(),
    http = require('http'),
    path = require('path'),
    async = require('async'),
    hbs = require('express-hbs'),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    engine = require('./models/gameengine.js');

app.configure(function() {
    app.set('port', process.env.PORT || 3000);
    app.set('view engine', 'handlebars');
    app.set('views', __dirname + '../app/scripts/views');
    app.use(express.static(path.join(__dirname, '../app')));
    app.use(express.static(path.join(__dirname, '../.tmp')));
});

app.get('/', function(req, res) {
    res.sendfile(path.join(__dirname, '../app/index.html'));
});

server.listen(app.get('port'));

io.sockets.on('connection', function(socket) {
    // Add the user to the game!
    engine.setSocketConnection(socket, io.sockets);
});