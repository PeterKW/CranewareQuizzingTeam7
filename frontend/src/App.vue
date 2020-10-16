<template>
  <div id="app">
    <GradientContainer :slider="sliderValue">
      <transition name="fade" mode="out-in">
        <Index class="h-100" v-on:onJoinLobby="onJoinLobby" v-on:onFindLobby="onFindLobby" v-on:onCreateLobby="onCreateLobby" v-on:updateBackground="updateBackground" v-on:updateSettings="updateSettings" v-on:updateVolume="updateVolume" v-if="currentView == 'index'"> </Index>
        <Lobby class="h-100" v-on:onLobbyStart="onLobbyStart" v-on:onLobbyExit="onLobbyExit" :players="players" :gamePin="gamePin" v-if="currentView == 'lobby'"></Lobby>
         <!-- Quiz won't always need access to players array but does for now while the player list is stored here -->
        <Quiz class="h-100" v-on:done='onQuizFinish' v-if="currentView == 'quiz'" :players="players" :options="settings" :volume="volume"></Quiz>
        <Leaderboard class="h-100" v-if="currentView == 'leaderboard'" v-on:onExitLeaderboard="onExitLeaderboard" :players="players"></Leaderboard>
      </transition>
    </GradientContainer>
  </div>
</template>

<script>
import Vue from "vue";

import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons)

// eslint-disable-next-line no-unused-vars
import Pusher from "pusher-js";

// Views
import Index from "./components/Index.vue";
import Lobby from "./components/Lobby.vue";
import Quiz from "./components/Quiz.vue";
import Leaderboard from "./components/Leaderboard.vue";

// Components
import GradientContainer from "./components/GradientContainer.vue";

export default {
  name: "App",
  data: function() {
    return {
      currentView: "index",

      // Vars for passing into Lobby
      players: [],
      gamePin: "",
      sliderValue: '',
      settings: '',

      // Instantiates a Pusher connection.
      pusher: new Pusher('072127b07acd646fc5ec',
      {
        cluster: 'eu',
        useTLS: true,
        authEndpoint: 'http://localhost:5000/pusher/auth'
      }),
      eventReader: null,
      player: {
          name: null,
          id: 0,
          score: 0,
          streak: 0,
        },
        channels: [],
        volume: ''
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

        // this.subToChannel(, false)
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
      // Will subscribe to a channel and add it to the list of channels.
      // channel is a string
      // isAnnouncementChan is a boolean. When false means events can only be read.
      subToChannel(channel, isAnnouncementChan)
      {
        // Helps track if channel connection succeeded
        let subscriptionSuccess = false;
        let newChannel;

        if(isAnnouncementChan)
        {
          // Create or grab an announcement channel.
          newChannel = this.pusher.subscribe(channel);
        }
        else
        {
          // Create or grab a private channel.
          newChannel = this.pusher.subscribe('private-' + channel);
        }

        // Listens for the event that informs us that the channel was subscribed to.
        newChannel.bind('pusher:subscription_succeeded', function()
        {
          subscriptionSuccess = true;
        })

        this.channels.push(newChannel);

        return subscriptionSuccess;
      },
      // TODO: implement search function below
      /*findChannel()
      {

      },*/

      // Listens to special events that can be found at https://pusher.com/docs/channels/using_channels/connection#connection-states
      // Runs the callback function when the event occurs.
      listenToPusherEvnts(event, callback)
      {
        this.pusher.connection.bind(event, callback);
      },
      listenToEvent(channel, event, callback)
      {
        // Will listen to an event on a channel, and run the callback function on the event's occurence
        // Only needs to be run once to read the specified events.
        this.pusher.subscribe(channel).bind(event, callback);
      },
      // Sends a json file through pusher on the specific channel as the specified event.
      // Channel is a channel object
      // Event is a string
      // jsonData is a json file/object
      sendData(channel, event, jsonData)
      {
        return channel.trigger(event, jsonData);
      },
      // Works like sendData but sends only a string as a message.
      sendMsg(channel, event, msg)
      {
        console.log(this.pusher);
        this.pusher.trigger(channel, event, { 'message': msg });
      },
      runTests()
      {
        const testChannel = 'tester';
        const testEvnt = 'client-test';
        const testMsg = 'This is a test';
        const jsonTest = { name: "abd", type: "water" };
        // Tests are stored in an array in the format string 'TestName':bool pass/fail
        const tests = [];

        // Create a channel instance
        if(this.subToChannel(testChannel, false))
        {
          // Test to see if channels can be subscribed to has passed
          tests.push({'ChannelConnectable':true});
          console.log('Successfully Connected to Channel: ' + testChannel);
          // If data is sent through the channel
          if(this.sendData(this.channels[0], testEvnt, jsonTest))
          {
            // The data file was sent successfully
            tests.push({'JSONDelivery':true});
          }
          else
          {
            // The file failed to be sent.
            tests.push({'JSONDelivery':false})
          }
        }
        else
        {
          // Channel failed to be subscribed to.
          tests.push({'ChannelConnectable':false});
          tests.push({'JSONDelivery':false})
        }

        /*if(this.pusher != null)
        {
          //this.sendMsg(testChannel, testEvnt, testMsg);
          this.sendData(testChannel, testEvnt, jsonF);
        }*/


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

          return tests;
        });

        console.log(tests);
      },

      updateBackground(sliderValue) {
        this.sliderValue = sliderValue
        this.$forceUpdate();
      },
      updateSettings(updateSettings){
        this.settings = updateSettings
      },
      updateVolume(updateVolume){
        this.volume = updateVolume
      }
    },

  /*mounted()
  {
    let evntHand = this.eventhandler;
    evntHand = new ClientEventHandler(true);
    evntHand.connectToChannel('private-channel');
    evntHand.listenForEvent(0,'test', function(){console.log(evntHand);console.log('Old handler:');console.log(this.eventhandler);});
    this.eventhandler = evntHand;
  },*/
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
