const io = require('socket.io')(5000);

io.on('connect', socket => {

  socket.on('onCreateLobby', (host) => {
    socket.username = host;
    socket.emit('onLobbyCreated', "a1b2c3d4");
  });
});