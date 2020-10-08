<template>
  <div id="app">
    <GradientContainer>
      <span class="h-100" v-show="currentView == 'index'">
        <Index
          v-on:join="join"
        > </index>
      </span>
      <transition name="fade">
        <Quiz class="h-100" v-if="currentView == 'quiz'"></Quiz>
        </transition>

    </GradientContainer>
  </div>
</template>

<script>
import Vue from 'vue'

import { BootstrapVue } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)

import Index from './components/Index.vue'
import Quiz from './components/Quiz.vue'

import GradientContainer from './components/GradientContainer.vue'

export default {
  name: 'App',
  data: function() {
    return {
      currentView: "index"
    }
  },
  components: {
    Index,
    Quiz,
    GradientContainer
  },
  methods: {
    join(type) {
      switch(type) {
        case "single":
          this.currentView = "quiz"
          break;
      }
    }
  }
}
</script>

<style>
html, body, #app, .container-fluid{ height: 100% !important }

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

input {
  text-align: center;
}
</style>
