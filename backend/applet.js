// Import Pusher dependancy
const Pusher = require('pusher');
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
// TODO: potentially remove following module and input command set up after.
/* const readline = require('readline');

const userInputReader = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});*/

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
	console.log(req);
	res.sendStatus(200);

});

/* class Player
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

	}
}*/

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

// Listening to port 5000
webapp.listen(5000);

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

// This class handles events to and from the client and server.
class EventHandler
{
	// Sends a json file through pusher on the specific channel as the specified event.
	// channel & event are strings
	// jsonData is a json file/object
	// isTestingOn is a bool which determines if the code should be tested.
	async sendData(channel, event, jsonData, isTestingOn)
	{
		pusher.trigger(channel, event, jsonData, function(err, req, res)
		{
			if(isTestingOn)
			{
				return testerInstance.evalResponse(err, req, res);
			}
		});
	}

	// Works like sendData but sends only a string as a message.
	sendMsg(channel, event, msg, isTestingOn)
	{
		this.sendData(channel, event, { 'message': msg }, isTestingOn);
	}

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
	const JSONTest = { 'message':'Let\'s go', 'test':'tested' };

	// TODO: Fix broken test. The code is working but the test jumps the gun. Will require async and await keywords to solve.
	testerInstance.testBoolFunction('isSendMessageWorking', evntManager.sendMsg(testChannel, testEvnt, testMsg, true));
	testerInstance.testBoolFunction('isSendDataWorking', evntManager.sendData(testChannel, testEvnt, JSONTest, true));

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
