// Import Pusher dependancy
const Pusher = require('pusher');
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
// TODO: potentially remove following module and input command set up after.
const readline = require('readline');

const userInputReader = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

// Serves as handler for routing
const webapp = express();

// Using bodyparser to enforce json rules
// Refer to https://www.npmjs.com/package/body-parser
webapp.use(bodyparser.json());
webapp.use(bodyparser.urlencoded({ extended: false }));

// Enable CORS to prevent errors when accessing
webapp.use(cors());

// Index API route for the Express app
webapp.get('/', function(req, res)
{
	res.send('Welcome');
});

// Instantiates the connection to the Pusher API
const pusher = new Pusher({
	appId: '1085899',
	key: '072127b07acd646fc5ec',
	secret: '48f388a42b3a7991bbc5',
	cluster: 'eu',
	useTLS: true,
});

// Authenticates users
webapp.post('/pusher/auth', function(req, res)
{
	const presence = { user_id: crypto.randomBytes(16).toString('hex') };
	const socketId = req.body.socket_id;
	const channel = req.body.channel_name;
	const auth = pusher.authenticate(socketId, channel, presence);
	res.send(auth);
});

// Recieve data from clients
webapp.post('/hook', (req, res) =>
{
<<<<<<< Updated upstream
	switch (req.message) {
		case expression:

			break;
		default:

	}
=======
	console.log(req);
>>>>>>> Stashed changes
	res.sendStatus(200);

<<<<<<< Updated upstream
});

// Triggers an event with a message to all clients subscribed to the specified channel.
function sendMsgEvent(channel, event, message)
{
	pusher.trigger(channel, event, {
		'message': message,
	});
}

// Triggers event with a json object of data to all clients subscribes to channel
function sendJSONEvent(channel, event, json)
{
	pusher.trigger(channel, event, { json });
}

// TODO: Replace the following with more meaningful function.
// Temporary event msg
sendMsgEvent('private-channel', 'test', 'This is a test');

// Listening to port 5000
webapp.listen(5000);

console.log('Application started.');

class Server
{

}

class Player
{
	constructor()
	{
		const name = null;
		const id = 0;
		const score = 0;
		const streak =0 ;
	}

	// Should send lobbyCode to server
	/*function connectToLobby(lobbyCode)
	{

	}

	// Sends the answer selected to the server
	function sendAnswerChoice(option)
	{

	}*/
}

/*class ClientEventHandler
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
=======
// Listening to port 5000
webapp.listen(5000);


// This class handles events to and from the client and server.
class EventHandler
{
	// Sends a json file through pusher on the specific channel as the specified event.
	// channel & event are strings
	// jsonData is a json file/object
	sendData(channel, event, jsonData)
	{
		pusher.trigger(channel, event, jsonData);
	}

	// Works like sendData but sends only a string as a message.
	sendMsg(channel, event, msg)
	{
		pusher.trigger(channel, event, { 'message': msg });
	}

	// Will listen to an event on a channel, and run the callback function on the event's occurence
	/* listenToEvent(channel, event, callback)
	{
		pusher.subscribe(channel).bind(event, callback);
	}*/
}

// This is a global EventHandler
const evntManager = new EventHandler();

// Is the main method that runs the usual server operation.
function main()
{
	tests();
}

// The test cases
function tests()
{

	const testChannel = 'private-channel';
	const testEvnt = 'test';
	const testMsg = 'This is a test';

	// Currently using readline to halt test until tester ensures a client instance is running.
	userInputReader.question('Press enter when ready to trigger event to run test', (ans) =>
	{
		console.log(ans);
		userInputReader.close();
	});

	// Send a message to all clients listening to the channel and event declared at the start of tests()
	evntManager.sendMsg(testChannel, testEvnt, testMsg);

	// Testing if data recieved from client is sent in expected format.
	/*evntManager.listenToEvent(testChannel, testEvnt, function(data)
	{
		return(data.message == testMsg);
	});*/

}

main();
>>>>>>> Stashed changes
