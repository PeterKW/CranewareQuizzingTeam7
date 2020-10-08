<template>
  <div id="app">
    <GradientContainer>
      <transition name="fade" mode="out-in">
        <Index class="h-100" v-on:join='join' v-if="currentView == 'index'"> </Index>
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

input {
  text-align: center;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
