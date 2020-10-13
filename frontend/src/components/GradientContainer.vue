<template>
    <div id="gradient" :style="gradient">
      <slot></slot>
    </div>
</template>

<script>
export default {
  name: 'GradientContainer',
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
  props: ["slider"],
  methods: {
    init(){
      this.step = 0
      this.istep = 0
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
      }, 0.1)
    }
  },
  watch: { 
    'slider': function(newVal) { 
      this.gradientSpeed = 0.0000005   * newVal
      this.init() 
    }
  },
  computed: {
    gradient() {
      return { 'background': "-webkit-gradient(linear, left top, right top, from(" + this.color1 + "), to(" + this.color2 + "))"}
    }
  },
  mounted() {
    this.init()
    }
}
</script>

<style scoped>
#gradient { height: 100% !important }
</style>
