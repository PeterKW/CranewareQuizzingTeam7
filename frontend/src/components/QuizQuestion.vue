<template>
  <div class="cont">
    <b-row class="text-center">
      <h2 class="question w-100">{{question}}</h2>
    </b-row>
    <b-row style="margin-bottom:10px">
      <b-col style="margin-right:10px;"><b-button v-if=!disableA @click="onAnswer('1')" class="fancy-btn btn--alpha"><span>{{a}}</span></b-button></b-col>
      <b-col><b-button v-if=!disableB @click="onAnswer('2')" class="fancy-btn btn--beta"><span>{{b}}</span></b-button></b-col>
    </b-row>
    <b-row>
      <b-col style="margin-right:10px;"><b-button v-if=!disableC @click="onAnswer('3')" class="fancy-btn btn--gamma"><span>{{c}}</span></b-button></b-col>
      <b-col><b-button v-if=!disableD @click="onAnswer('4')" class="fancy-btn btn--delta"><span>{{d}}</span></b-button></b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'QuizQuestion',

  data: function() {
    return {
      disableA: false,
      disableB: false,
      disableC: false,
      disableD: false,
      ID: 'QuizQuestion'
    };
  },

  props: [
      "question","a","b","c","d"
  ],
  methods: {

    //unhide all the buttons, used only for 50/50 power
    resetButtons() {
      this.disableA = false;
      this.disableB = false;
      this.disableC = false;
      this.disableD = false;
    },

    onAnswer(answer) {
      this.$emit('answer', answer);
      this.resetButtons(); //make sure all buttons visisble
    },

    /**
    * Take in a answer (A, B, C or D) and hide two other random buttons. I.e if
    * The answer passed in is A then two of B, C or D will be disabled at random
    * Commented out statements are for debugging purposes
    */
    disableButtons(answer) {

      //console.log("correct answer");
      //console.log(answer);

      //find which letter the answer corresponds to
      answer = this.findLetter(answer);

      //remove real answer from array of letters to remove
      var index = -1 * this.letterToNum(answer);
      var answerArray = ['A', 'B', 'C', 'D'];
      answerArray.splice(index, 1);

      //console.log("after answer has been removed");
      //console.log(answerArray);

      //remove and turn off two buttons

      var firstSplice = Math.floor((Math.random() * 3));
      //console.log("first splice index");
      //console.log(firstSplice);
      this.disableButton(answerArray[firstSplice]);
      answerArray.splice(firstSplice, 1);

      //console.log(answerArray);

      var secondSplice = Math.floor((Math.random() * 2));
      //console.log("second splice index");
      //console.log(secondSplice);
      this.disableButton(answerArray[secondSplice]);


      //console.log("array after splicing");
      //console.log(answerArray);
    },

    findLetter(answer) {
      switch (answer) {
        case this.a:
          return "A";
        case this.b:
          return "B";
        case this.c:
          return "C";
        case this.d:
          return "D";
      }
    },

    //Converts letter into ASCII and take it away from 65, 65 is the code for
    //a capital A, so A returns 0, B: 1 etc
    letterToNum(letter) {
      return 65 - letter.charCodeAt(0);
    },

    //hides the specified answer
    disableButton(letter) {
      //console.log("Letter to be disabled");
      //console.log(letter);
      switch (letter) {
        case 'A':
          this.disableA = true
          break;
        case 'B':
          this.disableB = true
          break;
        case 'C':
          this.disableC = true
          break;
        case 'D':
          this.disableD = true
          break;
      }
    },
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
  font-weight: 900;
  padding: 1.25rem 2rem;
  font-size: 1rem;
  border-radius: 3.5rem / 100%;
  position: relative;
  min-width: 15rem;
  max-width: 90vw;
  overflow: hidden;
  border: 0;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all $time;

  width:100%;
  height:100%;
  padding: 3vh 5vw;
  font-size: 250%;

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

.question {
  font-family: 'Source Sans Pro', sans-serif;
  text-align: center;
  top:150px;
  color: #000;
  padding:50px;
}

.quizButtons{
  width:100%;
  height:100%;
  padding: 3vh 5vw;
  font-size: 250%;
  background: -webkit-linear-gradient(#4b6cb7 0%, #182848 100%);
}
</style>
