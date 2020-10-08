// Import Pusher dependancy
const Pusher = require('pusher');
// const express = require('express');

// Logs all changes to connections to console
Pusher.logToConsole = true;

/*
// Servers as handler for routing
const webapp = express();

webapp.get('/', function(req, res)
{

})
*/

// Listening to port 5000
// webapp.listen(5000);

// Instantiates the connection to the Pusher API
const pusher = new Pusher({
	appId: '1085899',
	key: '072127b07acd646fc5ec',
	secret: '48f388a42b3a7991bbc5',
	cluster: 'eu',
	encrypted: true,
});

/* NOT FUNCTIONAL
// Subscribes to the test channel
const evntReader = pusher.subscribe('test');
*/

// Triggers an event
pusher.trigger('test', 'my-event', {
	'message': 'hello world',
});

/* NOT FUNCTIONAL
evntReader.bind('my-event', function(data)
{
	console.log('successful event recieved with ' + data.message);
});
*/
