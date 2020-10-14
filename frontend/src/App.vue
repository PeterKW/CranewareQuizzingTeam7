<template>
  <div id="app">
    <GradientContainer>
      <transition name="fade" mode="out-in">
        <Index class="h-100" v-on:onJoinLobby="onJoinLobby" v-on:onFindLobby="onFindLobby" v-on:onCreateLobby="onCreateLobby" v-if="currentView == 'index'"> </Index>
        <Lobby class="h-100" v-on:onLobbyStart="onLobbyStart" v-on:onLobbyExit="onLobbyExit" :players="players" :gamePin="gamePin" v-if="currentView == 'lobby'"></Lobby>
         <!-- Quiz won't always need access to players array but does for now while the player list is stored here -->
        <Quiz class="h-100" v-on:done='onQuizFinish' v-if="currentView == 'quiz'" :players="players"></Quiz>
        <Leaderboard class="h-100" v-if="currentView == 'leaderboard'" v-on:onExitLeaderboard="onExitLeaderboard" :players="players"></Leaderboard>
      </transition>
    </GradientContainer>
  </div>
</template>

<script>
  import Vue from "vue";

  import { BootstrapVue } from "bootstrap-vue";
  import "bootstrap/dist/css/bootstrap.css";
  import "bootstrap-vue/dist/bootstrap-vue.css";
  Vue.use(BootstrapVue);

  // eslint-disable-next-line no-unused-vars

  // Pusher included for event system
  import Pusher from "pusher-js";

  // Views
  import Index from "./components/Index.vue";
  import Lobby from "./components/Lobby.vue";
  import Quiz from "./components/Quiz.vue";
  import Leaderboard from "./components/Leaderboard.vue";

  // Components
  import GradientContainer from "./components/GradientContainer.vue";



  export default
  {
    name: "App",
    data: function()
    {
      return{
        currentView: "index",

        // Vars for passing into Lobby
        players: [],
        gamePin: "",

        // Instantiates a Pusher connection.
        pusher: new Pusher('072127b07acd646fc5ec',
        {
          cluster: 'eu',
          useTLS: true,
          authEndpoint: 'http://localhost:5000/pusher/auth'
        }),
        eventhandler: null,
        player: {
          name: null,
          id: 0,
          score: 0,
          streak: 0,
        },
      };
    },
    components: {
      Index,
      Lobby,
      Quiz,
      Leaderboard,
      GradientContainer
    },
    methods: {
      // eslint-disable-next-line no-unused-vars
      onJoinLobby(username, gamePin) {
        // TODO: Validate username and game pin and display lobby view
      },
      // eslint-disable-next-line no-unused-vars
      onFindLobby(username) {
        // TODO: Find lobby view shown here
      },
      onCreateLobby() {
        // TODO: Tell websocket we want a new lobby and get a pin back from the websocket
        // TODO: This block is temporary and a test
        // Logs all network communication information to console
        Pusher.logToConsole = true;

        // Run the tests on lobby creation.
        this.runTests();

        this.gamePin = "ABCDEF"
        this.currentView = "lobby";
      },
      // eslint-disable-next-line no-unused-vars
      onLobbyStart(code)
      {
        // TODO: Tell websocket to start and wait for response
        // For now: just start
        this.currentView = "quiz"
      },
      // eslint-disable-next-line no-unused-vars
      onLobbyExit(code)
      {
        this.currentView = "index"

        // TODO: Tell websocket lobby has been quit

        this.players = []
      },

      onQuizFinish()
      {
        this.currentView = "leaderboard"
      },

      onExitLeaderboard()
      {
        this.currentView = "index"
      },

      // Sends a json file to the server
      // Data is a json file.
      sendDataToServer(channel, event, data)
      {
        this.pusher.trigger(channel, event, data);
      },
      // Sends a message to the server
      sendMsgToServer(channel, event, msg)
      {
        // TODO: Fix the error caused on this line
        this.pusher.trigger(channel, event, JSON.parse({'message': msg}));
      },
      listenToEvent(channel, event, callback)
      {
        // Will listen to an event on a channel, and run the callback function on the event's occurence
        // Only needs to be run once to read the specified events.
        this.pusher.subscribe(channel).bind(event, callback);
      },
      // Sends a json file through pusher on the specific channel as the specified event.
      // channel & event are strings
      // jsonData is a json file/object
      sendData(channel, event, jsonData)
      {
        this.pusher.trigger(channel, event, jsonData);
      },
      // Works like sendData but sends only a string as a message.
      sendMsg(channel, event, msg)
      {
        this.pusher.trigger(channel, event, { 'message': msg });
      },
      // Listens to special events that can be found at https://pusher.com/docs/channels/using_channels/connection#connection-states
      // Runs the callback function when the event occurs.
      listenToPusherEvnts(event, callback)
      {
        this.pusher.connection.bind(event, callback);
      },
      runTests()
      {
        const testChannel = 'private-channel';
        const testEvnt = 'client-test';
        const testMsg = 'This is a test';
        // Tests are stored in an array in the format string 'TestName':bool pass/fail
        let tests = [];

        // Event that is sent when a connection to the API succeeded.
        this.listenToEvent(testChannel, 'pusher:subscription_succeeded', function()
        {
          console.log('Successfully Connected to Channel');
        });

        if(this.pusher != null)
        {
          this.sendMsg(testChannel, testEvnt, testMsg);
        }

        // Tests if the connection to the API was successful
        this.listenToPusherEvnts('connected', (conn) =>
        {
          console.log('Connected to Pusher API successfully.');
          console.log(conn);
          tests.push({'APIConnTest':true});
        });
        this.listenToPusherEvnts('failed', function(conn)
        {
          console.log('Failed Connected to Pusher API successfully.');
          console.log(conn);
          tests.push({'APIConnTest':false});
        });

        // Tests if data is being sent and recieved to and from the server. Sends the same data to server to ensure data is sent back and forth correctly.
        // this.sendMsg(testChannel, testEvnt, testMsg);

        this.listenToEvent(testChannel, testEvnt, function(data){
          console.log("Recieved the following data:");
          console.log(data);

          if(data.message == testMsg)
          {
            tests.push({'RecievingData':true});
          }
          else
          {
            tests.push({'RecievingData':false})
          }

        });
      }
    },
  /*mounted()
  {
    let evntHand = this.eventhandler;
    evntHand = new ClientEventHandler(true);
    evntHand.connectToChannel('private-channel');
    evntHand.listenForEvent(0,'test', function(){console.log(evntHand);console.log('Old handler:');console.log(this.eventhandler);});
    this.eventhandler = evntHand;*/

    /*let externalScript = document.createElement('script')
    externalScript.setAttribute('src', 'C:/Users/adidu/Desktop/Assignments/CranewareQuizzingTeam7/frontend/src/classes.js')
    document.head.appendChild(externalScript)
  }*/
  };
</script>

<style>
  html,
  body,
  #app,
  .container-fluid {
    height: 100% !important;
  }

  input {
    text-align: center;
  }

  .players {
    background-color: #fff; /* Fallback color */
    color: #000;
    border-radius:10px;
    font-weight: bold;
    text-align: center;
    border: 2px solid #f1f1f1;
    position: absolute;
    width: 100%;
    padding: 20px;
    top: 20%;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>
