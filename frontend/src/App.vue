<template>
  <div id="app">
    <GradientContainer :slider="sliderValue">
      <transition name="fade" mode="out-in">
        <Index class="h-100" v-on:onJoinLobby="onJoinLobby" v-on:onFindLobby="onFindLobby" v-on:onCreateLobby="onCreateLobby" v-on:updateBackground="updateBackground" v-on:updateSettings="updateSettings" v-on:updateVolume="updateVolume" v-if="currentView == 'index'"> </Index>
        <Lobby class="h-100" v-on:onLobbyStart="onLobbyStart" v-on:onLobbyExit="onLobbyExit" :players="players" :gamePin="gamePin" v-if="currentView == 'lobby'"></Lobby>
         <!-- Quiz won't always need access to players array but does for now while the player list is stored here -->
        <Quiz class="h-100" v-on:done='onQuizFinish' v-if="currentView == 'quiz'" :players="players" :currentQuestion="currentQuestion" :options="settings" :volume="volume"></Quiz>
        <Leaderboard class="h-100" v-if="currentView == 'leaderboard'" v-on:onExitLeaderboard="onExitLeaderboard" :players="lb"></Leaderboard>
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
import VueSocketIO from 'vue-socket.io'
Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://localhost:5000',
}))

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
      players: {},

      // Vars for passing into Quiz
      currentQuestion: {},

      //
      lb: [],

      gamePin: "",
      sliderValue: '',
      settings: '',
      player: {
          name: null,
          id: 0,
          score: 0,
          streak: 0,
      },
      channels: [],
      volume: ''
    }
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
    onJoinLobby(name, pin) {
      this.$socket.emit('onJoinLobby', name, pin);
    },
    // eslint-disable-next-line no-unused-vars
    onFindLobby(username) {
      // TODO: Find lobby view shown here
    },
    onCreateLobby(name) {
        this.$socket.emit('onCreateLobby', name)
    },
    // eslint-disable-next-line no-unused-vars
    onLobbyStart()
    {
      // TODO: Tell websocket to start and wait for response
      // For now: just start
      // TODO: Only show this button to the host.
      this.$socket.emit('onLobbyStart', this.gamePin)
    },
    // eslint-disable-next-line no-unused-vars
    onLobbyExit(code)
    {
      this.currentView = "index"

      // TODO: Tell websocket lobby has been quit

      this.players = []
    },

    onQuizFinish(lb)
    {
      this.lb = lb
      //this.currentView = "leaderboard"
    },
    onExitLeaderboard()
    {
      this.currentView = "index"
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
  sockets: {
    onError: function(data){
      //TODO: Proper error messages
      alert(data)
    },
    onLobbyCreated: function(data) {
      console.log(data);

      this.players = data.players;
      this.gamePin = data.gamePin;

      this.currentView = "lobby";
    },
    onLobbyJoined: function(data) {
      this.players = data.players;
      this.gamePin = data.gamePin;

      this.currentView = "lobby";
    },
    onPlayerJoin: function(data) {
      Vue.set(this.players, data.socket, data)
    },

    onLobbyStarted: function(question)
    {
      this.currentView = "quiz";
      this.currentQuestion = question
    },
    onPlayerDisconnected: function() {
      console.log('Player disconnected');
    }
  }
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
