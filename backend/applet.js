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
	console.log(req.body);
	res.sendStatus(200);
});

// Triggers an event
pusher.trigger('private-lobby', 'my-event', {
	'message': 'hello world',
});

// Listening to port 5000
webapp.listen(5000);

console.log('Application started.');
