// Import Pusher dependancy
const Pusher = require('pusher');
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');

// Logs all changes to connections to console
Pusher.logToConsole = true;

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
	switch (req.message) {
		case expression:

			break;
		default:

	}
	res.sendStatus(200);

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
