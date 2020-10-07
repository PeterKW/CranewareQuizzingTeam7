<template>
  <div id="app">
    <GradientContainer>
      <span class="h-100" v-show="currentView == 'index'">
        <Index
          v-on:join="join"
        />
      </span>

      <div class="h-100" v-show="currentView == 'quiz'">
        <Quiz/>
      </div>
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
</style>
