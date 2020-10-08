<template>
  <div id="app">
    <GradientContainer>
      <transition name="fade" mode="out-in">
        <Index class="h-100" v-on:join='join' v-if="currentView == 'index'"> </Index>
        <Quiz class="h-100" v-if="currentView == 'quiz'"></Quiz>
        <Leaderboard class="h-100" v-if="currentView == 'leaderboard'"></Leaderboard>
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

import Index from "./components/Index.vue";
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
