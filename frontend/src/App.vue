<template>
  <div id="app">
    <GradientContainer>
      <span class="h-100" v-if="currentView == 'index'">
        <Index v-on:onJoinLobby="onJoinLobby" v-on:onFindLobby="onFindLobby" v-on:onCreateLobby="onCreateLobby"/>
      </span>

      <div class="h-100" v-if="currentView == 'lobby'">
        <Lobby v-on:onLobbyStart="onLobbyStart" v-on:onLobbyExit="onLobbyExit" :players="players" :gamePin="gamePin"/>
      </div>

      <div class="h-100" v-if="currentView == 'quiz'">
        <Quiz v-on:done="onQuizFinish"/>
      </div>

      <div class="h-100" v-if="currentView == 'leaderboard'">
        <Leaderboard :players="players"/>
      </div>
    </GradientContainer>
  </div>
</template>

<script>
import Vue from "vue";

import { BootstrapVue } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
Vue.use(BootstrapVue);

import Index from "./components/Index.vue";
import Lobby from "./components/Lobby.vue";
import Quiz from "./components/Quiz.vue";
import Leaderboard from "./components/Leaderboard.vue";

import GradientContainer from "./components/GradientContainer.vue";

export default {
  name: "App",
  data: function() {
    return {
      currentView: "index",
      players: [],
      gamePin: ""
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
    onCreateLobby(username) {
      // TODO: Tell websocket we want a new lobby
      // For now: we create and assign our own
      this.players = [
        {
          "id" : 1,
          "name" : username,
          "score" : 0
        }
      ]
      this.gamePin = "ABCDEF"
      this.currentView = "lobby";
    },

    // eslint-disable-next-line no-unused-vars
    onLobbyStart(code) {
      // TODO: Tell websocket to start and wait for response w code

      // For now: just start
      this.players = []
    },
    // eslint-disable-next-line no-unused-vars
    onLobbyExit(code){
      this.currentView = "index"

      // TODO: Tell websocket lobby has been quit

      this.players = []
    },

    onQuizFinish() {
      this.currentView = "leaderboard"
    }
  },
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
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.2); /* Black w/opacity/see-through */
  color: white;
  font-weight: bold;
  text-align: center;
  border: 2px solid #f1f1f1;
  position: absolute;
  width: 100%;
  padding: 20px;
  top: 20%;
}
</style>
