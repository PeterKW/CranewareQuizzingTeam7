<template>
  <div id="app" :style="gradient">
    <GradientContainer>
      <Index/>
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
import GradientContainer from './components/GradientContainer.vue'

export default {
  name: 'App',
  components: {
    Index,
    GradientContainer
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
