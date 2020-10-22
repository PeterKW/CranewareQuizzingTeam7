<template>
  <div class="mx-auto" style="width: 40vw; margin-top: 15px; max-width: 456%">
    <div class="row justify-content-center align-self-center">
      <b-row style="margin-bottom:10px">
        <b-col><b-button @click="onPower('doublep')" class="fancy-btn btn--alpha" :disabled='this.doubleUsed'><span>Double Points</span></b-button></b-col>
        <b-col ><b-button @click="onPower('50/50')" class="fancy-btn btn--beta" :disabled='this.fiftyUsed'><span>50/50</span></b-button></b-col>
      </b-row>
      <b-row>
        <b-col><b-button @click="onPower('half')" class="fancy-btn btn--gamma" :disabled='this.halfUsed'><span>Half Score</span></b-button></b-col>
        <b-col><b-button @click="onPower('counter')" class="fancy-btn btn--delta" :disabled='this.counterUsed'><span>Counter</span></b-button></b-col>
        <b-col style="position: absolute"><b-dropdown :text="playerChoice.username" class="m-md-2">
          <b-dropdown-item v-for="player in players" :key="player.socket" :value="player"
            @click="target(player)">
            {{player.username}}
          </b-dropdown-item>
        </b-dropdown></b-col>
      </b-row>
    </div>
  </div>
</template>
<script>

var used = [false, false, false, false]
var temp = ['']
export default {
  name: 'PowerBar',
  props: ["players"],
  data: function () {
    return {
      doubleUsed : used[0],
      fiftyUsed : used[1],
      halfUsed: used[2],
      counterUsed : used[3],
      playerChoice : temp,
      ID: "PowerBar",
    }
},

  methods: {
    target(player) {
      this.playerChoice = [player.username]
    },
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
        case 'half':
          this.halfUsed = true
          used[2] = true
          break;
        case 'counter':
          this.counterUsed = true
          used[3] = true
          break;
        default:
      }
      this.$emit('power', power);
    },

    resetButtons() {
      used[0] = false;
      used[1] = false;
      used[2] = false;
      used[3] = false;
      this.doubleUsed  = used[0];
      this.fiftyUsed = used[1];
      this.halfUsed = used[2];
      this.counterUsed = used[3];
    }
  },
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


.radio-toolbar {
  margin: 10px;
}

.radio-toolbar input[type="radio"] {
  opacity: 0;
  position: fixed;
  width: 0;
}

.radio-toolbar label {
    display: inline-block;
    background-color: #ddd;
    padding: 10px 20px;
    font-family: sans-serif, Arial;
    font-size: 16px;
    border: 2px solid #444;
    border-radius: 4px;
}

.radio-toolbar label:hover {
  background-color: #dfd;
}

.radio-toolbar input[type="radio"]:focus + label {
    border: 2px dashed #444;
}

.radio-toolbar input[type="radio"]:checked + label {
    background-color: #bfb;
    border-color: #4c4;
}


.scrollBox {
  outline:none;
  height:9vh;
  width:6vw;
  overflow:auto;
}


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
