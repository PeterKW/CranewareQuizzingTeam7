<template>
  <div id="app">
    <GradientContainer>
      <span class="h-100" v-if="currentView == 'index'">
        <Index v-on:join="join" />
      </span>

      <div class="h-100" v-if="currentView == 'lobby'">
        <Lobby/>
      </div>

      <div class="h-100" v-if="currentView == 'quiz'">
        <Quiz v-on:done="onQuizFinish"/>
      </div>

      <div class="h-100" v-if="currentView == 'leaderboard'">
        <Leaderboard/>
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
    join(type) {
      switch (type) {
        case "single":
          this.currentView = "quiz";
          break;

        case "find":
          break;

        case "create":
          this.currentView = "lobby";
          break;
      }
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
