class CranehootServer {
  constructor(){
    this.lobbies = []

    const io = require('socket.io')(5000);

    io.on('connect', socket => {

      socket.on('onCreateLobby', (host) => {
        socket.emit('onLobbyCreated', this.newLobby(
          {
            'socket' : socket.id, 
            username : host
          }
        ));
      });

      socket.on('onJoinLobby', (username, gamePin) => {
        // Validate game pin
        if(this.lobbyExists(gamePin)){
          socket.emit("onError", "FOUND!")
        }
        else{
          socket.emit("onError", "Invalid game pin")
        }
      });
    });
  }

  newLobby(hostData){
    // TODO: Generate a pin
    var pin = "abcdefgh";

    var lobby = new Lobby(hostData, pin)
    this.lobbies.push(lobby)

    return lobby
  }

  lobbyExists(pin) {
    console.log("pin: " + pin)
    console.log(this.lobbies)
    return (this.lobbies.find(x => x.gamePin === pin) === undefined ? false : true)
  }
}

class Lobby {
  constructor(hostData, pin) {
    this.gamePin = pin
    this.players = [new Player(hostData.socket, hostData.username)]
  }

  get host(){
    return players[0]
  }
}

class Player {
  constructor(socket, username) {
    this.socket = socket
    this.username = username
    this.points = 0
  }
}

var cranehootServer = new CranehootServer();