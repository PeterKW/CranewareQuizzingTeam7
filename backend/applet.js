// Setup for utilizing socket.io
const crypto = require('crypto');
const express = require('express');
const webapp = express();
const cors = require('cors');
webapp.use(cors());
const port = 5000;
const listener = webapp.listen(port);
const io = require('socket.io').listen(listener, () =>
{
	// Informs that the server is running.
	console.log('Server running on port ' + port);
});

class CranehootServer
{
	constructor()
	{
		this.lobbies = {};

		this.start()
	}

	start() {
		io.on('connect', socket =>
		{
			socket.on('onCreateLobby', (username) => {
				var newLobby = this.newLobby();
				var player = new Player(socket.id, username)

				newLobby.addPlayer(player)

				console.log(this.lobbies)

		        socket.emit('onLobbyCreated', newLobby);
		     });

			socket.on('onJoinLobby', (username, gamePin) =>
			{
				// Validate game pin
				if(gamePin in this.lobbies)
				{
					var lobby = this.lobbies[gamePin];

					// New player object
					var newPlayer = new Player(socket.id, username)
					lobby.addPlayer(newPlayer)

					// Tell all the other players that someone has joined
					lobby.players.forEach(function(player){
						if(newPlayer == player) return

						io.sockets.sockets[player.socket].emit('onPlayerJoin', newPlayer)
					});

					// Tell client they have successfully joined
					socket.emit('onLobbyJoined', lobby)
				}
				else
				{
					socket.emit('onError', 'Invalid game pin');
				}
			});

			// Starts the game for all users.
			socket.on('startGame', (code) =>
			{
				if(code in this.lobbies)
				{
					const lobby = this.lobbies[code];
					lobby.players.forEach((player) =>
					{
						io.sockets.sockets[player.socket].emit('beginGame');
					});
				}
			});
		});
	}

	newLobby()
	{
	    var pin = Math.random().toString(36).substring(7);

		this.lobbies[pin] = new Lobby(pin);

		console.log(this.lobbies)

		return this.lobbies[pin];
	}

	generateLobbyPin() {

	}

	/*joinLobby(code, socket, username)
	{
		this.lobbies[gamePin].players.push(new Player(socket.id, username))
	}
	*/
}

// Represents a lobby
class Lobby
{
	constructor(pin)
	{
		this.gamePin = pin
		this.players = []
	}

	addPlayer(player) {
		this.players.push(player)
	}

	get host(){
    	return this.players[0]
  	}
}

// represents a player.
class Player
{
	constructor(socket, username)
	{
		this.username = username;
		this.socket = socket;

		this.score = 0;
		this.streak = 0;
	}
}

// Logs new connections to the server.
io.on('connection', () =>
{
	console.log('New player detected!');
});

// Helps to run tests.
class Tester
{
	constructor()
	{
		// Stores the outcome of all tests
		this.testResults = [];
	}

	// Will return a bool based on if the HTTP response suceeds.
	evalResponse(err, req, res)
	{
		// If the err exists
		if(err != null)
		{
			// Log the err and return false.
			console.log('Message failed to send');
			console.log(err);
			return false;
		}
		else if(res.statusCode == 200)
		{
			// Returns true if the response suceeded.
			console.log('Sending message...');
			return true;
		}
		else if(req.method == 'POST')
		{
			console.log('Sending request to send message.');
		}
	}

	// Will test a bool function and add its result to the testResults.
	// boolFunction is a function that returns a bool.
	// testName is a string that represents the test.
	testBoolFunction(testName, boolFunction)
	{
		if(boolFunction)
		{
			console.log('Event sent to channel successfully');
			this.testResults.push({ testName:true });
		}
		else
		{
			console.log('Event failed to send to channel');
			this.testResults.push({ testName:false });
		}
	}
}

const testerInstance = new Tester();


// Is the main method that runs the usual server operation.
function main()
{
	// tests();
	const craneHoot = new CranehootServer();
}

// The test cases
function tests()
{
	const testChannel = 'private-channel';
	const testEvnt = 'test';
	const testMsg = 'This is a test';
	const JSONTest = { 'message':'Let\'s go', 'test':'tested' };

	// TODO: Fix broken test. The code is working but the test jumps the gun. Will require async and await keywords to solve.
	// testerInstance.testBoolFunction('isSendMessageWorking', evntManager.sendMsg(testChannel, testEvnt, testMsg, true));
	// testerInstance.testBoolFunction('isSendDataWorking', evntManager.sendData(testChannel, testEvnt, JSONTest, true));

	// Currently using readline to halt test until tester ensures a client instance is running.
	/* userInputReader.question('Press enter when ready to trigger event to run test', (ans) =>
	{
		console.log(ans);
		userInputReader.close();
	});*/

	/* evntManager.listenToEvent(testChannel, 'pusher:subscription_succeeded', function()
	{
		console.log('Successfully connected to channel ' + testChannel);
	});*/

	/* evntManager.listenToEvent(testChannel, testEvnt, function(data)
	{
		console.log('event heard:');
		console.log(data);
	});*/

	// Testing if data recieved from client is sent in expected format.
	/* evntManager.listenToEvent(testChannel, testEvnt, function(data)
	{
		return(data.message == testMsg);
	});*/

}

main();
