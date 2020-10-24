<template>
  <div class="mx-auto" style="width: 40vw; margin-top: 15px; max-width: 456%">
    <div class="row justify-content-center align-self-center">
      <b-row style="margin-bottom:10px">
        <b-col><b-button @click="onPower('doublep')" class="fancy-btn btn--alpha" :disabled='this.doubleUsed'><span>{{doubleStr}}</span></b-button></b-col>
        <b-col ><b-button @click="onPower('50/50')" class="fancy-btn btn--beta" :disabled='this.fiftyUsed'><span>{{fiftyStr}}</span></b-button></b-col>
      </b-row>
      <b-row style="margin-bottom:10px; margin-left: 10px;">
        <b-col><b-button @click="onPower('half')" class="fancy-btn btn--gamma" :disabled='this.halfUsed'><span>Half Score</span></b-button></b-col>
        <!-- Counter method, some of the code is availible for this so I'll leave it in, but it works inconsistantly-->
        <!--b-col><b-button @click="onPower('counter')" class="fancy-btn btn--delta" :disabled='this.counterUsed'><span>Counter</span></b-button></b-col-->
        <b-dropdown :text="playerChoice.username" class="m-md-2">
          <b-dropdown-item v-for="player in players" :key="player.socket" :value="player"
            @click="target(player)">
            {{player.username}}
          </b-dropdown-item>
        </b-dropdown>
        <b-col style="position: absolute"></b-col>
      </b-row>
    </div>
  </div>
</template>
<script>

//hold references to values to get around Vue garbage collection
var used = [false, false, false, false]
var temp = ['']
var double = ['Double Points', 0]
var fifty = ['50/50', 0]
export default {
  name: 'PowerBar',
  props: ['round' , 'players'],
  data: function () {
    return {
      //variables for if powerups should be active
      doubleUsed : used[0],
      fiftyUsed : used[1],
      halfUsed: used[2],
      //counterUsed : used[3],
      playerChoice : temp,
      ID: "PowerBar", //ID to identify this child
      double: double[0],
      fifty: fifty[0],
      doubleRound: double[1],
      fiftyRound: fifty[1],

      fiftyStr: fifty[0],
      doubleStr: double[0]
    }
  },

  watch: {
    //Methods for powerups cooldowns
    'round': function() {
      //If arrays are not used for storing values,
      //then Vue loses the values everytime the component is reloaded
      //for reference:
      //var double = ['Double Points', 0]
      //var fifty = ['50/50', 0]
      if(double[1] != 0)
        double[1] = double[1] - 1
        double[0] = 'Use in: ' + double[1] + ' rounds'
      if(double[1] == 0){
        used[0] = false
        double[0] = 'Double Points'
      }

      if(fifty[1] != 0)
        fifty[1] = fifty[1] - 1
        fifty[0] = 'Use in: ' + fifty[1] + ' rounds'
      if(fifty[1] == 0){
        used[1] = false
        fifty[0] = '50/50'
      }
    }
  },

  methods: {
    //Methods for button clicks
    target(player) {
      this.playerChoice = [player.username]
    },

    //handles disabling the powers so they can't be used multiple times in a row
    //references to arrays to avoid vue garbage collection
    onPower(power) {

      switch (power) {
        case 'doublep':
          this.doubleUsed = true
          used[0] = true
          double[1] = 3
          double[0] = 'Use in: ' + double[1] + ' rounds'
          break;
        case '50/50':
          this.fiftyUsed = true
          used[1] = true
          fifty[1] = 3
          fifty[0] = 'Use in: ' + fifty[1] + ' rounds'
          break;
        case 'half':
          if (this.playerChoice != '') { //if they didn't target anyone
            this.halfUsed = true
            used[2] = true
          }
          break;
        case 'counter': //currently unaccessible
          this.counterUsed = true
          used[3] = true
          break;
        default:
      }
      this.$emit('power', power);
    },

    //return all the buttons to being unused
    resetButtons() {
      used[0] = false;
      used[1] = false;
      used[2] = false;
      used[3] = false;
      this.doubleUsed  = used[0];
      this.fiftyUsed = used[1];
      this.halfUsed = used[2];
    }
  },
}
</script>

<style lang="scss" scoped>
//Taken and modified from: https://codepen.io/CiTA/pen/YBQjVQ
$time: 330ms;

$btns: (
  alpha: (
    gstart: #007FAA,
    gend:#9B59B6,
    tstart: #ffffff,
    tend: #ffffff
  ),
  beta: (
    gstart:  #008080,
    gend:  #008000,
    tstart: #ffffff,
    tend: #ffffff
  ),
  gamma: (
    gstart: #9F6519,
    gend: #b8496a,
    tstart: #ffffff,
    tend: #ffffff
  ),
  delta: (
    gstart: #D43900,
    gend: #352125,
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
  font-size: 100%;

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
    background-color: #008080;
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

@media (max-width: 768px) {
  .fancy-btn {
    min-width: 8rem;
  }
}
</style>
