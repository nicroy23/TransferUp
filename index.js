var express = require("express");
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
app.use(express.static("public"));

const crypto = require('crypto');

io.on('connection', (socket) => {
  console.log('a user connected');

  var id = crypto.randomBytes(10).toString('hex');
  socket.join(id);
  io.to(id).emit('new-room', id);
  console.log('ID: ' + id);

  socket.on('transfer-to', (info) => {
    socket.join(info.room);
    io.to(id).emit('base64-file', info.file);
  });
});

const port = process.env.PORT || 80

http.listen(port, () => {
  console.log('listening on *:80');
});
