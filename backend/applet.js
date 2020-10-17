// Setup for utilizing socket.io
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

// represents a player.
class Player
{
	constructor(data)
	{
		this.name = data.name;
		this.id = this.generateID();
		this.score = 0;
		this.streak = 0;
	}

	generateID()
	{
		return Math.floor(Math.random() * 10000 + 1000);
	}

	// Should send lobbyCode to server
	/* function connectToLobby(lobbyCode)
	{

	}

	// Sends the answer selected to the server
	function sendAnswerChoice(option)
	{

	}*/
}

// Represents a lobby
class Lobby
{
	constructor(host)
	{
		this.players[host.id] = host;
		this.code = this.generateCode();
		this.hostID = host.id;
	}

	generateCode()
	{
		return 'abcd'; // crypto.randomBytes(6).toString('hex').slice(0, 4);
	}

	getLobbyMembers()
	{
		let playersInLobby = '';
		this.players.forEach(player => playersInLobby += player.name + ',');
		return playersInLobby;
	}
}

// This class handles events to and from the client and server.
class EventHandler
{
	// Sends a json file through pusher on the specific channel as the specified event.
	// channel & event are strings
	// jsonData is a json file/object
	// isTestingOn is a bool which determines if the code should be tested.
	/* async sendData(channel, event, jsonData, isTestingOn)
	{
		// TODO: Replace with socket.io data delivery method.
		trigger(channel, event, jsonData, function(err, req, res)
		{
			if(isTestingOn)
			{
				return testerInstance.evalResponse(err, req, res);
			}
		};
	}*/

	// Works like sendData but sends only a string as a message.
	/* sendMsg(channel, event, msg, isTestingOn)
	{
		this.sendData(channel, event, { 'message': msg }, isTestingOn);
	}*/

	// Will listen to an event and run the callback function on the event's occurence
	/* listenToEvent(channel, event, callback)
	{
		pusher.bind(channel, event, callback);
	}*/

	// Listens to all events and uses the callback function for all of them. The function can take a variable which is the incoming data.
	/* listenToAllEvents(callback)
	{
		pusher.bind_global(callback);
	}*/
}

// This is a global EventHandler
const evntManager = new EventHandler();

// Recieve data from clients
webapp.post('/hook', (req, res) =>
{
	console.log(req.body);
	const firstEvent = req.body.events[0];
	const data = JSON.parse(firstEvent.data);
	const code = firstEvent.channel.replace('private-', '');

	switch(firstEvent.event)
	{
	case 'client-new-lobby':
		createLobby(data);
		break;
	case 'client-join':
		joinLobby(code, data);
		break;
	}

	evntManager.sendData();

	// if(firstEvent.startsWith())

	res.sendStatus(200);
});

const lobbies = {};

// Event fired when a client makes a connection to the server host(this is where multiple lobbies can exist)
io.on('connection', (conn) =>
{
	console.log('User connected successfully:	\n' + conn);
});

// When a user requests to create a lobby
io.on('createLobby', (user) =>
{
	if(user != null)
	{
		const host = new Player(user);
		const newLobby = new Lobby(host);
		io.emit('lobbyCreated', true);
	}
	else
	{
		console.log('ERROR: Host data not sent in correct format.');
	}
});

function joinLobby(code, data)
{
	if(lobbies[code] == null)
	{
		console.log('\nPlayer failed to join lobby due to lobby not existing.\n');
		return;
	}

	const newPlayer = new Player(data);

	if (lobbies[code].players.length == 0)
	{
		lobbies[code].host = newPlayer.id;
	}
	lobbies[code].players.push(newPlayer);
	getLobbySize(lobbies[code]);
	console.log(lobbies[code].players);
	evntManager.sendMsg('private-' + data.user_id, 'approved', '', true);
	// Inform all users of joined player.
	evntManager.sendMsg('private-' + code, 'update-lobby', lobbies[code].getLobbyMembers(), true);
}

function getLobbySize(lobby)
{
	console.log(lobby.players.length);
}

function createLobby(data)
{
	const code = generateCode();
	const newLobby = new Lobby(code, data.name, data.host);


	lobbies[code] = newLobby;
	evntManager.sendMsg('private-lobby-manager', 'lobby-created', newLobby.code, true);
}

/* class ClientEventHandler
{
	const isLoggingOn = false;
	const connectedChannels = [];

	constructor(logging)
	{
		setLogging(logging);
	}
	constructor()
	{
		this.isLoggingOn = false;
	}

	// Allows logs to be turned on or off
	function setLogging(onOff)
	{
		// Logs all network communication information to console
		this.isLoggingOn = onOff;
		Pusher.logToConsole = onOff;
	}

	// Channels are streams over which events can be sent. All channels should private-
	function connectToChannel(channel)
	{
		connectedChannels.push(pusher.subscribe(channel));
	}

	// Will listen for a particular event on a single channel
	function listenForEvent(channelNo, event, callback)
	{
		connectedCHannels[channelNo].bind(event, callback);
	}


	function findChannelNo(channelName)
	{

	}
}*/

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
	tests();
	console.log();
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
