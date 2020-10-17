class CranehootServer {
  constructor(){
    this.lobbies = []

    this.start()
  }

  start() {
    const io = require('socket.io')(5000);

    io.on('connect', socket => {

      socket.on('onCreateLobby', (host) => {
        socket.emit('onLobbyCreated', this.newLobby(host));
      });
    });
  }

  newLobby(host){
    // TODO: Generate a pin
    var pin = "abcdefgh";

    var lobby = new Lobby(host, pin)
    this.lobbies.push(lobby)

    return lobby
  }
}

class Lobby {
  constructor(host, pin) {
    this.gamePin = pin
    this.players = [new Player(0, host)]
  }

  get host(){
    return players[0]
  }
}

class Player {
  constructor(id, username) {
    this.id = id;
    this.username = username;
    this.points = 0;
  }
}

var cranehootServer = new CranehootServer();