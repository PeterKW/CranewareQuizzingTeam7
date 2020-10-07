<template>
  <div id="app">
    <GradientContainer>
      <div v-show="currentView == 'index'">
        <Index
          v-on:join="join"
        />
      </div>

      <div v-show="currentView == 'quiz'">
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
html, body, #app { height: 100% !important }

input {
  text-align: center;
}

.text-responsive {
  font-size: calc(100% + 4vw + 4vh);
}
</style>
