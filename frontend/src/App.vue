<template>
  <div id="app">
    <div id="gradient" :style="gradient">
      <Index/>
    </div>
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
  },
  data: function () {
    return {
      color1: 0,
      color2: 0,
      colors: new Array(
        [62,35,255],
        [60,255,60],
        [255,35,98],
        [45,175,230],
        [255,0,255],
        [255,128,0]
      ),
      step: 0,
      colorIndices: [0,1,2,3],
      gradientSpeed: 0.002
    }
  },
  computed: {
    gradient() {
      return { 'background': "-webkit-gradient(linear, left top, right top, from(" + this.color1 + "), to(" + this.color2 + "))"}
    }
  },
  mounted() {
     //Taken and modified from: https://codepen.io/quasimondo/pen/lDdrF
      window.setInterval(() => {
        var c0_0 = this.colors[this.colorIndices[0]];
        var c0_1 = this.colors[this.colorIndices[1]];
        var c1_0 = this.colors[this.colorIndices[2]];
        var c1_1 = this.colors[this.colorIndices[3]];

        var istep = 1 - this.step;
        var r1 = Math.round(istep * c0_0[0] + this.step * c0_1[0]);
        var g1 = Math.round(istep * c0_0[1] + this.step * c0_1[1]);
        var b1 = Math.round(istep * c0_0[2] + this.step * c0_1[2]);
        this.color1 = "rgb("+r1+","+g1+","+b1+")";

        var r2 = Math.round(istep * c1_0[0] + this.step * c1_1[0]);
        var g2 = Math.round(istep * c1_0[1] + this.step * c1_1[1]);
        var b2 = Math.round(istep * c1_0[2] + this.step * c1_1[2]);
        this.color2 = "rgb("+r2+","+g2+","+b2+")";
          
        this.step += this.gradientSpeed;
        if ( this.step >= 1 )
        {
          this.step %= 1;
          this.colorIndices[0] = this.colorIndices[1];
          this.colorIndices[2] = this.colorIndices[3];
          
          //pick two new target color indices
          //do not pick the same as the current one
          this.colorIndices[1] = ( this.colorIndices[1] + Math.floor( 1 + Math.random() * (this.colors.length - 1))) % this.colors.length;
          this.colorIndices[3] = ( this.colorIndices[3] + Math.floor( 1 + Math.random() * (this.colors.length - 1))) % this.colors.length;
          
        }
      }, 10)
    }
  }
</script>

<style>
html,
#gradient {
  height: 100%;
  position: fixed;
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
