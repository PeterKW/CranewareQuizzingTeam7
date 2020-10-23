// Setup for utilizing socket.io
const express = require('express');
const webapp = express();
const cors = require('cors');
webapp.use(cors());
const port = 5000;
const listener = webapp.listen(port);

var mysql = require('mysql');
var db = require('./db'); // Database info JSON

const io = require('socket.io').listen(listener, () =>
{
	// Informs that the server is running.
	console.log('Server running on port ' + port);
});

class Database {
	constructor() {
		this.database = mysql.createConnection({
		  host: db.host,
		  user: db.user,
		  password: db.password,
		  database: db.database,
		  multipleStatements: true
		});
	}

	getRandomQuestion (callback) {
		var id = Math.floor(Math.random() * 943) + 1;
		// gets question and answers and sends back in JSON form
		this.database.query("CALL query_QuestionById(?, @category,@question_content,@correct_answer,@answer1, @answer2, @answer3, @answer4); select @category,@question_content,@correct_answer,@answer1, @answer2, @answer3, @answer4", [id], function(err, localResult) { // Send query
			if (err && err.length != 0) throw err;
			console.log(id);
			console.log(localResult[1]);
			var result = localResult[1];
			let question = {
			  result
			}
			return callback(question.result[0]); // Pass back info
		});
	}
	getQuestionFromCat (callback,category) {
			this.database.query("call query_OneQuestionByCategory(?, @id, @category,@question_content,@correct_answer,@answer1, @answer2, @answer3, @answer4); select @category,@question_content,@correct_answer,@answer1, @answer2, @answer3, @answer4", [category], function(err, localResult) { // Send query
				if (err && err.length != 0) throw err;
				var result = localResult[1];
				let question = {
				  result
				}
				return callback(question.result[0]); // Pass back info
			});
	//	});

	}
}
const database = new Database();

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
				var player = new Player(socket.id, username, newLobby.gamePin)

				newLobby.addPlayer(player)

				// Store reference to player on the socket
				socket.player = player;

				socket.emit('onLobbyCreated', newLobby);
			});

			socket.on('disconnect', (reason) => {
				if (reason === 'io server disconnect') {
				  	// the disconnection was initiated by the server, you need to reconnect manually
				  	socket.connect();
				}
				else {

					//This might be needed still delete this.lobbies[socket.player.lobby].players[socket.id];

					if (Object.keys(this.lobbies[socket.player.lobby].players).length < 1) {
						this.lobbies[socket.player.lobby] = null;
					}
				}
				// else the socket will automatically try to reconnect
			});

			socket.on('attackPlayer', (gamePin, target, aggrevator) =>
			{
				const lobby = this.lobbies[gamePin];
				const lobbyPlayers = lobby.players;

				for (const key in lobbyPlayers)
				{
					if (lobbyPlayers[key].username == target)
					{
						io.sockets.sockets[key].emit('playerTargetted', aggrevator);
					}
				}
			});

			socket.on('punishPlayer', (gamePin, target) =>
			{
				const lobby = this.lobbies[gamePin];
				const lobbyPlayers = lobby.players;

				for (const key in lobbyPlayers)
				{
					if (lobbyPlayers[key].username == target)
					{
						console.log(key);
						console.log('Found player: ' + target);
						io.sockets.sockets[key].emit('playerIncorrectlyHalved');
					}
				}
			});

			socket.on('onJoinLobby', (username, gamePin) =>
			{
				// Validate game pin
				if(gamePin in this.lobbies)
				{
					var lobby = this.lobbies[gamePin];

					if (lobby.hasGameStarted) {
						socket.emit('onError', 'Game has already started');
						return;
					}

					// New player object
					var newPlayer = new Player(socket.id, username, lobby.gamePin)
					lobby.addPlayer(newPlayer)

					// Store reference to player on the socket
					socket.player = newPlayer;

					lobby.notifyAll("onPlayerJoin", newPlayer)

					/*for(const playerID in lobby.players){
						if(newPlayer == lobby.players[playerID]) continue;

						io.sockets.sockets[playerID].emit('onPlayerJoin', newPlayer)
					}*/

					// Tell client they have successfully joined
					socket.emit('onLobbyJoined', lobby)
				}
				else
				{
					socket.emit('onError', 'Invalid game pin');
				}
			});

			// Starts the game for all users.
			socket.on('onLobbyStart', (code, category, questionTime, questionNumber) =>
			{
				this.lobbies[code].category = category;
				this.lobbies[code].timePerQuestion = questionTime;
				this.lobbies[code].noOfQuestions = questionNumber;
				this.lobbies[code].start();
			});


			socket.on('onAnswer', (answer, doublePoints, halfPoints, gamePin) =>
			{
				var player = socket.player;
				var lobby = this.lobbies[socket.player.lobby]

				lobby.onPlayerAnswer(player, answer, doublePoints, halfPoints, gamePin)
			});

			socket.on('updateScore', (gamePin, playerName) => {

				var player = socket.player;
				var playerSocket = player.socket;
				var tempScore = 0.5 * player.questionResults.score
				player.score -= tempScore;
	      player.questionResults = {
		    	verdict : "Correct!",
 	        score : tempScore
				}
				io.sockets.sockets[playerSocket].emit('resetHalf');
			});

			socket.on('getCurrPlayers', () =>
			{
				var player = socket.player;
				var lobby = this.lobbies[socket.player.lobby];
				socket.emit('onCurrentPlayers', Object.keys(lobby.players).length);
			});
		});
	}

	newLobby()
	{
	  var pin = Math.random().toString(36).substring(7);

		this.lobbies[pin] = new Lobby(pin);
		return this.lobbies[pin];
	}
}

// Represents a lobby
class Lobby
{
	constructor(pin)
	{
		this.gamePin = pin
		this.players = {}

		this.leaderboard = [];

		this.currentQuestion = {}
		this.qCount = 0;

		this.timer = 10
		this.timerInstance = null

		// TODO: Customisable in the future?
		this.category = ["all"];
		this.timePerQuestion = 15;
		this.noOfQuestions = 5;

		// Im lazy
		this.timer2 = 5
		this.timerInstance2 = null

		this.hasGameStarted = false;
	}

	start() {
		this.hasGameStarted = true;
		//this.nextQuestion("onLobbyStarted")
		//this.notifyAll("onLobbyStarted")
		this.loop()
	}

	loop() {
		if (Object.keys(this.players).length < 1) {
			return;
		}
	   	if(this.qCount > this.noOfQuestions){
		 	this.notifyAll("onQuizEnd", this.getLeaderboard())
		 	return
		 }
		if (this.qCount ==0)
		{
			this.nextQuestion("onLobbyStarted")
		}
		else
		{
			this.nextQuestion("onNextQuestion");
		}
		this.timer = this.timePerQuestion

		this.timerInstance = setInterval(() => {
			this.notifyAll("onTimerTick", this.timer)
			console.log(this.currentQuestion['@correct_answer']);
	    	if(this.timer-- <= 0) {
	    		clearInterval(this.timerInstance)

	    		this.sendQuestionResults();
	      	}
	    }, 1000)
	}

	onPlayerAnswer(player, answer, doublePoints, halfPoints, gamePin) {
		// Verify their answer
		// TODO: fix a bug where the first answer might be wrong even when it's right
		//console.log("HERE");
		//console.log(answer);
		//console.log(this.currentQuestion["@correct_answer"]);
		var playerSocket = player.socket;
		if(this.currentQuestion["@correct_answer"] == this.currentQuestion["@answer" + answer]) {
			console.log(this.timer);
			if(this.timer==0)
			{
				this.timer++;
			}

			if (halfPoints && doublePoints) {
				var tempScore = this.timer * 100
			} else if (halfPoints) {
				var tempScore = this.timer * 50
			} else if (doublePoints) {
				var tempScore = this.timer * 100 * 2
			} else {
				var tempScore = this.timer * 100
			}

	    player.streak++

	    if(player.streak > 1){
	      tempScore += (100 * player.streak)
	     }

	     player.score += tempScore;

	     player.questionResults = {
	     		verdict : "Correct!",
	        score : tempScore
	       }
				 if (halfPoints) {
				 		io.sockets.sockets[playerSocket].emit('resetHalf');
				 }

		}
		else {
			player.streak = 0

			player.questionResults = {
	        	verdict : "Incorrect!",
	        	score : 0
	        }

			if (halfPoints) {
				io.sockets.sockets[playerSocket].emit('incorrectlyTargetted');
			}
			if (doublePoints) {
				io.sockets.sockets[playerSocket].emit('incorrectlyDoubled');
				player.score -= 500;
				player.questionResults = {
		        	verdict : "Incorrect!",
		        	score : -500
		        }
			}
		}
	}

	sendQuestionResults() {
		var leaderboard = this.getLeaderboard()


		for(const playerID in this.players) {
			var player = this.players[playerID]
			try {
				if(Object.keys(player.questionResults).length > 0){
					io.sockets.sockets[playerID].emit(
						"onResults",
						{
							"verdict" : player.questionResults.verdict,
							"score"   : player.questionResults.score,
							"streak"  : player.streak,
							"playerScores" : leaderboard,
              				"correctAnswer" : this.currentQuestion["@correct_answer"]
						}
					);
				}
				else {
					io.sockets.sockets[playerID].emit(
						"onResults",
						{
							"verdict" : "You did not select an answer.",
							"score"   : "0",
							"streak"  : player.streak,
							"playerScores" : leaderboard,
							"correctAnswer" : this.currentQuestion["@correct_answer"]

						}
					);
				}

				player.questionResults = {}
			}
			catch(e) {
				// Disconnected
				delete this.players[playerID];
				this.notifyAll("onPlayerDisconnected", {});
			}
		}


		this.timer2=5;
		this.timerInstance2 = setInterval(() => {
			this.notifyAll("onTimerTick2", this.timer2)

	    	if(this.timer2-- <= 0) {
	    		 clearInterval(this.timerInstance2)
	    		 this.loop();
	      	}
	    }, 1000)
	}

	getLeaderboard(){
		var leaderboard = Object.values(this.players)
		leaderboard.sort((a, b) => b.score - a.score)

		return leaderboard
	}

	nextQuestion(e) {
		this.qCount++;
		var that = this;
		//checks if a category has been selcted
		if(this.category.length!=0)
		{
			//picks random category from list of categories chosen
			let cat = Math.floor(Math.random() * this.category.length);
			database.getQuestionFromCat(function(question) {
				that.currentQuestion = question;
				that.notifyAll(e, question);
			},this.category[cat]);
		}
		else
		{
			//gets random question if no category is selected
			database.getRandomQuestion(function(question) {
				that.currentQuestion = question;
				that.notifyAll(e, question);
			});
		}
	}

	// Will allow all users to be updated when an event occurs.
	// event is a string one wants to send
	// data is a json object or a single data type
	notifyAll(event, data)
	{
		for(const playerID in this.players) {
			try {
				io.sockets.sockets[playerID].emit(event, data);
			}
			catch(e) {
				// They've disconnected
				delete this.players[playerID];
				this.notifyAll("onPlayerDisconnected", {});
			}
		}
	}

	addPlayer(player) {
		this.players[player.socket] = player;
	}

	get host(){
    	return this.players[0]
  	}
}

// represents a player.
class Player
{
	constructor(socket, username, lobby)
	{
		this.username = username;
		this.socket = socket;
		this.lobby = lobby;

		this.score = 0;
		this.streak = 0;

		this.questionResults = {}
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
