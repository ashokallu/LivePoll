// process.title = 'pubsub-app';

var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var redis = require("redis");

server.listen(3001);

// app.use(function(req, res, next){
//   console.log('%s %s', req.method, req.url);
//   next();
// });

app.use(function(req, res, next) {
  console.log('%s %s', req.method, req.url);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

io.sockets.on('connection', function (socket) {

  var subscribe = redis.createClient();
  subscribe.subscribe('status.create');

  subscribe.on("message", function(channel, message) {
    console.log("from rails to subscriber:", channel, message);
    socket.emit('message', message)
  });

  socket.on('disconnect', function () {
    console.log("user disconnected");

    subscribe.quit();
  });

});
