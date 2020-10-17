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

		io.on('connect', socket =>
		{
			// TODO: Remove following line that makes a temporary lobby.
			this.newLobby('MrTest');
			socket.on('onCreateLobby', (host) =>
			{
				socket.emit('onLobbyCreated', this.newLobby(host));
			});

			socket.on('serverJoinLobby', (username, gamePin) =>
			{
				// Validate game pin
				if(gamePin in this.lobbies)
				{
					this.joinLobby(gamePin, username);
					console.log(this.lobbies[gamePin]);
					socket.emit('onJoinLobby', this.lobbies[gamePin]);
				}
				else
				{
					socket.emit('onError', 'Invalid game pin');
				}
			});
		});
	}

	newLobby(host)
	{
		const lobby = new Lobby(new Player(host));
		this.lobbies[lobby.code] = lobby;
		return lobby;
	}

	joinLobby(code, username)
	{
		const newPlayer = new Player(username);
		this.lobbies[code].players[newPlayer.id] = newPlayer;
	}

	lobbyExists(pin)
	{
		console.log('pin: ' + pin);
		console.log(this.lobbies);
		return (this.lobbies.find(x => x.gamePin === pin) === undefined ? false : true);
	}
}

// represents a player.
class Player
{
	constructor(username)
	{
		this.name = username;
		this.id = this.generateID();
		this.score = 0;
		this.streak = 0;
	}

	generateID()
	{
		return Math.floor(Math.random() * 10000 + 1000);
	}
}

// Represents a lobby
class Lobby
{
	constructor(host)
	{
		this.players = {};
		this.players[host.id] = host;
		this.code = this.generateCode();
		this.hostID = host.id;
	}

	generateCode()
	{
		// TODO: Uncomment the following.
		return 'abcd'; // crypto.randomBytes(6).toString('hex').slice(0, 4);
	}

	getLobbyMembers()
	{
		let playersInLobby = '';
		this.players.forEach(player => playersInLobby += player.name + ',');
		return playersInLobby;
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
