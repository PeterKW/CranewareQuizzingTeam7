// Setup for utilizing socket.io
const express = require('express');
const webapp = express();
const cors = require('cors');
webapp.use(cors());
const port = 5000;
const listener = webapp.listen(port);

// Database connection additions
const mysql = require('mysql');
const db = require('./db');

// Socket.io is imported and listens to the port chosen
const io = require('socket.io').listen(listener, () =>
{
	// Informs that the server is running.
	console.log('Server running on port ' + port);
});

// Represents the database and allows interaction with the database.
class Database
{
	// Database connection is established here
	constructor()
	{
		this.database = mysql.createConnection(
			{
				host: db.host,
				user: db.user,
				password: db.password,
				database: db.database,
				multipleStatements: true,
			});
	}

	// Retrieves a random question from the database and then runs the callback function.
	// @callback - function to run once question is recieved from the database.
	getRandomQuestion(callback)
	{
		const id = Math.floor(Math.random() * 943) + 1;
		// gets question and answers and sends back in JSON form
		this.database.query('CALL query_QuestionById(?, @category,@question_content,@correct_answer,@answer1, @answer2, @answer3, @answer4); select @category,@question_content,@correct_answer,@answer1, @answer2, @answer3, @answer4', [id], function(err, localResult)
		{ // Send query
			if (err && err.length != 0) throw err;
			console.log('Retrieving question...');
			const result = localResult[1];
			const question = { result	};
			return callback(question.result[0]); // Pass back info
		});
	}

	// Gets a random question from a specific category
	// @callback - function whichto run once the data is grabbed from the database
	// @category - A string that represents a category
	getQuestionFromCat(callback, category)
	{
		// Querying database for question in a category
		this.database.query('call query_OneQuestionByCategory(?, @id, @category,@question_content,@correct_answer,@answer1, @answer2, @answer3, @answer4); select @category,@question_content,@correct_answer,@answer1, @answer2, @answer3, @answer4', [category], function(err, localResult)
		{ // Send query
			if (err && err.length != 0) throw err;
			const result = localResult[1];
			const question = { result };
			return callback(question.result[0]); // Pass back info
		});
	}
}

// An instance of the database is created
const database = new Database();

// Represents the server
class CranehootServer
{
	// It stores a dictionary of lobbies for ease of access
	constructor()
	{
		this.lobbies = {};
	}

	// turns event listeners on and contains definitions for various events
	start()
	{
		// When the connection is established
		io.on('connect', socket =>
		{
			console.log('IO connected...');
			// The event that is resolved when a lobby is created
			socket.on('onCreateLobby', (username) =>
			{
				console.log('\nLobby created with host: ' + username);
				const newLobby = this.newLobby();
				// Player object to represent host
				const player = new Player(socket.id, username, newLobby.gamePin);

				newLobby.addPlayer(player);

				// Store reference to player on the socket
				socket.player = player;
				// Send onLobbyCreated event with the lobby created as a payload
				socket.emit('onLobbyCreated', newLobby);
			});

			// The event triggered by socket.io when a io client disconnects
			socket.on('disconnect', (reason) =>
			{
				// Keep the server connected in case of disconnects
				if (reason === 'io disconnect')
				{
					// the disconnection was initiated by the server, you need to reconnect manually
					socket.connect();
				}
				else if(socket.player != null)
				{
					// Player disconection
					console.log('\nPlayer with following data disconnected:');
					console.log(socket.player);
					// If there are no players in a lobby
					if(Object.keys(this.lobbies[socket.player.lobby].players).length < 1)
					{
						// Delete the lobby
						this.lobbies[socket.player.lobby] = null;
					}
				}
			});

			// Event for the powerup which halves an opponent's score
			socket.on('attackPlayer', (gamePin, target, aggrevator) =>
			{
				// Retrieving the relevant lobby and dictionary of players
				const lobby = this.lobbies[gamePin];
				const lobbyPlayers = lobby.players;

				// Looping through players to find the targeted player to carry out powerup attack
				for (const key in lobbyPlayers)
				{
					if (lobbyPlayers[key].username == target)
					{
						// Send the player targetted event to trigger further
						io.sockets.sockets[key].emit('playerTargetted', aggrevator);
					}
				}
			});

			// TODO: Add the reciever event that handles playerIncorrectlyHalved event
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

			/* The event handler for when a user joins a lobby
			** @username String - The user's username
			** @gamePin String - The code to join a lobby
			**/
			socket.on('onJoinLobby', (username, gamePin) =>
			{
				// Validate game pin
				if(gamePin in this.lobbies)
				{
					const lobby = this.lobbies[gamePin];

					// Lock a lobby if a game has begun, send an onError event which alerts the user that the lobby cannot be entered.
					if (lobby.hasGameStarted)
					{
						socket.emit('onError', 'Game has already started');
						return;
					}

					// New player object is created and added to the dictionary of players in the lobby.
					const newPlayer = new Player(socket.id, username, lobby.gamePin);
					lobby.addPlayer(newPlayer);

					// Store reference to player on the socket
					socket.player = newPlayer;

					// Informs all players that a user has joined the lobby
					lobby.notifyAll('onPlayerJoin', newPlayer);

					// User successfully joins a lobby and is shown the lobby screen
					socket.emit('onLobbyJoined', lobby);
				}
				else
				{
					socket.emit('onError', 'Invalid game pin');
				}
			});

			/* Sets the lobby settings and starts the game for all users.
			** @code - The code to enter a lobby and find it in the lobby dictionary
			** @category - Category of questions to retrieve questions from
			** @questionTime - The time for each question
			** @questionNumber - The number of questions in the quiz until the quiz ends
			**/
			socket.on('onLobbyStart', (code, category, questionTime, questionNumber) =>
			{
				this.lobbies[code].category = category;
				this.lobbies[code].timePerQuestion = questionTime;
				this.lobbies[code].noOfQuestions = questionNumber;
				this.lobbies[code].start();
			});

			/* Sends data to the lobby object to calculate a score
			** @answer String - The answer
			** @doublePoints bool - When true will double the points of the question
			** @halfPoints bool - When true will half the points of the question
			** @gamePin String - Code used to join and find the lobby in the lobby dictionary
			**/
			socket.on('onAnswer', (answer, doublePoints, halfPoints, gamePin) =>
			{
				const player = socket.player;
				const lobby = this.lobbies[socket.player.lobby];

				lobby.onPlayerAnswer(player, answer, doublePoints, halfPoints, gamePin);
			});

			// Awards half the score of a question
			socket.on('updateScore', () =>
			{
				const player = socket.player;
				const playerSocket = player.socket;
				const tempScore = 0.5 * player.questionResults.score;
				player.score -= tempScore;
				player.questionResults = { verdict : 'Correct!', score : tempScore };
				// Will send an event to make the next question worth full points
				io.sockets.sockets[playerSocket].emit('resetHalf');
			});

			// Send the number of players in a lobby
			socket.on('getCurrPlayers', () =>
			{
				const player = socket.player;
				const lobby = this.lobbies[socket.player.lobby];
				socket.emit('onCurrentPlayers', Object.keys(lobby.players).length);
			});
		});
	}

	// Creates a new lobby and adds it to a dictionary of lobbies
	newLobby()
	{
		// A pin is generated to be the join code for the lobby
		const pin = Math.random().toString(36).substring(7);
		this.lobbies[pin] = new Lobby(pin);
		return this.lobbies[pin];
	}
}

// Represents a lobby
class Lobby
{
	// Creates a lobby with the specific join code
	// @pin - The pin code to join a lobby.
	constructor(pin)
	{
		this.gamePin = pin;
		// dictionary of players in lobby
		this.players = {};
		// array of player's scores
		this.leaderboard = [];

		this.currentQuestion = {};
		// Number of questions before game for the lobby ends
		this.qCount = 0;

		this.timer = 10;
		this.timerInstance = null;

		// TODO: Customisable in the future?
		this.category = ['all'];
		this.timePerQuestion = 15;
		this.noOfQuestions = 5;

		this.timer2 = 5;
		this.timerInstance2 = null;

		this.hasGameStarted = false;
	}

	// Starts the game
	start()
	{
		this.hasGameStarted = true;
		this.loop();
	}

	// The main game loop
	loop()
	{
		if(this.qCount > this.noOfQuestions)
		{
			// Ends quiz if the questions answered has surpassed the number of questions set by user or the default number of questions.
			this.notifyAll('onQuizEnd', this.getLeaderboard());
			return;
		}
		if (this.qCount == 0)
		{
			// Shows the question page after the lobby when no questions have been finished
			this.nextQuestion('onLobbyStarted');
		}
		else
		{
			// Grabs next question
			this.nextQuestion('onNextQuestion');
		}
		this.timer = this.timePerQuestion;

		this.timerInstance = setInterval(() =>
		{
			// Updates all user's timers until the timer runs out.
			this.notifyAll('onTimerTick', this.timer);
			if(this.timer-- <= 0)
			{
				clearInterval(this.timerInstance);

				// Sends the results of the question and stops the next question from being half the points.
				this.sendQuestionResults();
				this.notifyAll('resetHalf');
			}
		}, 1000);
	}

	/* Calculates a player's score
	** player - Player object
	** answer String - A string of the answer selected by the player
	** doublePoints bool - Determines if the question is worth double the points
	** halfPoints bool - Determines if the question was worth half its points
	** gamePin String - Code to find a lobby
	**/
	onPlayerAnswer(player, answer, doublePoints, halfPoints, gamePin)
	{
		// Verify a player's answer
		const playerSocket = player.socket;
		if(this.currentQuestion['@correct_answer'] == this.currentQuestion['@answer' + answer])
		{
			// Make sure next question is not worth half points.
			io.sockets.sockets[playerSocket].emit('resetHalf');
			if(this.timer == 0)
			{
				this.timer++;
			}

			let tempScore;
			// Calculate points based on if the score has been altered due to a powerup.
			if(halfPoints === doublePoints)
			{
				tempScore = this.timer * 100;
			}
			else if(halfPoints)
			{
				tempScore = this.timer * 50;
			}
			else if(doublePoints)
			{
				tempScore = this.timer * 100 * 2;
			}

			// Increase the streak and Calculate the bonus points
			player.streak++;
			if(player.streak > 1)
			{
				tempScore += (100 * player.streak);
			}

			player.score += tempScore;

			player.questionResults = { verdict : 'Correct!', score : tempScore };

		}
		else
		{
			// When the answer is incorrect, reset the streak
			player.streak = 0;

			player.questionResults = { verdict : 'Incorrect!', score : 0 };

			if(halfPoints)
			{
				// Send event to remove a notification from UI
				io.sockets.sockets[playerSocket].emit('incorrectlyTargetted');
			}
			if(doublePoints)
			{
				/* When the user chooses the incorrect answer after choosing to double their points
					their score is reduced by 500
				**/
				io.sockets.sockets[playerSocket].emit('incorrectlyDoubled');
				player.score -= 500;
				player.questionResults = { verdict : 'Incorrect!', score : -500 };
			}
		}
	}

	// Sends the question results after a question to each player
	sendQuestionResults()
	{
		const leaderboard = this.getLeaderboard();


		for(const playerID in this.players)
		{
			const player = this.players[playerID];
			try
			{
				// if the player chose an answer
				if(Object.keys(player.questionResults).length > 0)
				{
					// Send the onResults event with the score data to the client
					io.sockets.sockets[playerID].emit(
						'onResults',
						{
							'verdict' : player.questionResults.verdict,
							'score'   : player.questionResults.score,
							'streak'  : player.streak,
							'playerScores' : leaderboard,
							'correctAnswer' : this.currentQuestion['@correct_answer'],
						},
					);
				}
				else
				{
					// Send the onResults event with information about not selecting an answer
					io.sockets.sockets[playerID].emit(
						'onResults',
						{
							'verdict' : 'You did not select an answer.',
							'score'   : '0',
							'streak'  : player.streak,
							'playerScores' : leaderboard,
							'correctAnswer' : this.currentQuestion['@correct_answer'],
						},
					);
				}

				player.questionResults = {};
			}
			catch(e)
			{
				// Disconnected user when player does not exist
				delete this.players[playerID];
				this.notifyAll('onPlayerDisconnected', {});
			}
		}

		// Start a timer and inform all users how long until the next question begins.
		this.timer2 = 5;
		this.timerInstance2 = setInterval(() =>
		{
			this.notifyAll('onTimerTick2', this.timer2);

			if(this.timer2-- <= 0)
			{
				clearInterval(this.timerInstance2);
				this.loop();
			}
		}, 1000);
	}

	// Sorts and retrieves the leaderboard
	getLeaderboard()
	{
		const leaderboard = Object.values(this.players);
		leaderboard.sort((a, b) => b.score - a.score);

		return leaderboard;
	}

	/* Grabs next question with the event as a String
	** @e String - The event to be sent
	*/
	nextQuestion(e)
	{
		// The question count is increased
		this.qCount++;
		const that = this;
		// checks if a category has been selcted
		if(this.category.length != 0)
		{
			// picks random category from list of categories chosen
			const cat = Math.floor(Math.random() * this.category.length);
			database.getQuestionFromCat(function(question)
			{
				that.currentQuestion = question;
				that.notifyAll(e, question);
			}, this.category[cat]);
		}
		else
		{
			// gets random question if no category is selected
			database.getRandomQuestion(function(question)
			{
				that.currentQuestion = question;
				that.notifyAll(e, question);
			});
		}
	}

	/* Will allow all users to be updated when an event occurs.
	** event is a string one wants to send
	** data is a json object or a single data type
	*/
	notifyAll(event, data)
	{
		for(const playerID in this.players)
		{
			try
			{
				// Send the event to the specific player with any data
				io.sockets.sockets[playerID].emit(event, data);
			}
			catch(e)
			{
				// They've disconnected
				delete this.players[playerID];
				this.notifyAll('onPlayerDisconnected', {});
			}
		}
	}

	// Add the player to the lobby's dictionary of players
	addPlayer(player)
	{
		this.players[player.socket] = player;
	}

	// Retrieve the player who made the lobby.
	get host()
	{
		return this.players[0];
	}
}

// represents a player.
class Player
{
	/* Creates a player instance
	** @socket String - Socket id as a string
	** @username String - Username string
	** @gameCode String - String that helps find the lobby in a dictionary
	**/
	constructor(socket, username, gameCode)
	{
		this.username = username;
		this.socket = socket;
		this.lobby = gameCode;

		this.score = 0;
		this.streak = 0;

		this.questionResults = {};
	}
}

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

	/* Will test a bool function and add its result to the testResults.
	** boolFunction is a function that returns a bool.
	** testName is a string that represents the test.
	**/
	testBoolFunction(testName, boolFunction)
	{
		if(boolFunction)
		{
			console.log('Test successful: ' + testName);
			this.testResults.push({ testName:true });
		}
		else
		{
			console.log('Test failed: ' + testName);
			this.testResults.push({ testName:false });
		}
	}
}

// Is the main method that runs the usual server operation.
function main()
{
	// tests();
	const craneHoot = new CranehootServer();
	craneHoot.start();
}

main();
