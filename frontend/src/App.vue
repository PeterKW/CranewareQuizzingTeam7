<template>
  <div id="app">
    <Index/>
  </div>
</template>

<script>
import Vue from 'vue'

import { BootstrapVue } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)

import Index from './components/Index.vue'

export default {
  name: 'App',
  components: {
    Index
  }
}
</script>

<style>
html,
body {
  height: 100%;
}

body {
  position: fixed;
}

#gradient {
  width: 100%;
  height: 800px;
  padding: 0px;
  margin: 0px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-size: 100% auto;
}

.display-1 {
  text-align: center;
  color: azure;
}

.main-form {
  width: 20vw;
  padding-top: 10%;
}

.container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

input {
  text-align: center;
}

.text-responsive {
  font-size: calc(100% + 4vw + 4vh);
}
</style>
