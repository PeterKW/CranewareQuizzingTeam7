<template>
  <div class="w-50 p-2" style="margin-top: 15px; max-width: 35%">
    <div class="row justify-content-center align-self-center">
    <b-row style="margin-bottom:10px">
      <b-col><b-button @click="onPower('doublep')" class="fancy-btn btn--alpha" :disabled='this.doubleUsed'><span>Double Points</span></b-button></b-col>
      <b-col ><b-button @click="onPower('50/50')" class="fancy-btn btn--beta" :disabled='this.fiftyUsed'><span>50/50</span></b-button></b-col>
    </b-row>
    <b-row>
      <b-col><b-button @click="onPower('C')" class="fancy-btn btn--gamma" :disabled='this.disable'><span>Template</span></b-button></b-col>
      <b-col ><b-button @click="onPower('D')" class="fancy-btn btn--delta" :disabled='disable'><span>Template</span></b-button></b-col>
    </b-row>
  </div>
  </div>
</template>

<script>

var used = [false, false, true]
export default {
  name: 'PowerBar',
  data: function () {
    return {
      doubleUsed : used[0],
      fiftyUsed : used[1],
      disable : used[2],
    }
},

  methods: {
    onPower(power) {

      switch (power) {
        case 'doublep':
          this.doubleUsed = true
          used[0] = true
          break;
        case '50/50':
          this.fiftyUsed = true
          used[1] = true
          break;
        default:

      }

      this.$emit('power', power);
    }
  }
}
</script>

<style lang="scss" scoped>
//Taken and modified from: https://codepen.io/CiTA/pen/YBQjVQ
$time: 330ms;

$btns: (
  alpha: (
    gstart: #21D4FD,
    gend: #B721FF,
    tstart: #ffffff,
    tend: #ffffff
  ),
  beta: (
    gstart: #08AEEA,
    gend: #2AF598,
    tstart: #ffffff,
    tend: #ffffff
  ),
  gamma: (
    gstart: #FEE140,
    gend: #FA709A,
    tstart: #ffffff,
    tend: #ffffff
  ),
  delta: (
    gstart: #3EECAC,
    gend: #EE74E1,
    tstart: #ffffff,
    tend: #ffffff
  )
);

.fancy-btn {
  font-family: 'Source Sans Pro', sans-serif;
  font-weight: 700;
  padding: 1.25rem 2rem;
  font-size: 1rem;
  border-radius: 3.5rem / 100%;
  position: relative;
  min-width: 5rem;
  max-width: 12vw;
  overflow: hidden;
  border: 0;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all $time;

  width:100%;
  height:100%;
  padding: 1vh 2vw;
  font-size: 125%;

  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  display: block;
  line-height: 1em; /* a */
  min-height: 3em; /* a x number of line to show (ex : 2 line)  */

  & + & {
    margin-top: 1rem;
  }

  span {
    position: relative;
    z-index: 1;
  }

  &:before {
    content: "";
    background-color: #21D4FD;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: scale(4) translateX(-100%);
    transition: all $time * 1.5 ease-out;
  }

  &:hover,
  &:focus,
  &:active {
    &:before {
      transform: scale(4) translate(37%);
    }
  }
}


@each $bname, $bcolors in $btns {
  .btn--#{$bname} {
    background-color: map-get($bcolors, gstart);
    color: map-get($bcolors, tstart);

    &:before {
      background-color: map-get($bcolors, gend);
      background-image: linear-gradient(to right, map-get($bcolors, gend) 30%, map-get($bcolors, gstart) 100%);
      position: absolute;
    }

    &:hover,
    &:focus,
    &:active {
      color: map-get($bcolors, tend);
    }
  }
}
</style>
