<template>
  <b-container fluid>
     <b-row class="h-100 align-items-center">
        <b-col cols="10" class="mx-auto text-center p4">
          <b-row class="w-100" style="margin-bottom: 5px;">
            <p class="timer ml-auto">{{timer}}</p>
          </b-row>
          <QuizQuestion v-if="!answered" v-on:answer="onAnswerQuestion" :question="currentQuestion['@question_content']" :a="currentQuestion['@answer1']" :b="currentQuestion['@answer2']" :c="currentQuestion['@answer3']" :d="currentQuestion['@answer4']"/>

          <div v-if="answered" class="cont">
            <b-row class="text-center w-100">
              <h1 class="question w-100" style="padding-top:60px">Waiting for results...</h1>
            </b-row>
          </div>

          <QuizScore v-if="results" :verdict="verdict" :score="questionScore" :scoreStreak="scoreStreak"/>

          <PowerBar class="powers" v-if="!answered" v-on:power="onPower"/>
      </b-col>
      <b-button v-b-tooltip.hover title="Sound effects & music obtained from www.zapsplat.com" size="lg" variant="primary" class="mb-2 license">
        <b-icon icon="info-circle-fill" aria-label="Help"></b-icon>
      </b-button>
    </b-row>

  </b-container>

</template>

<script>
import QuizQuestion from "./QuizQuestion.vue";
import QuizScore from "./QuizScore.vue";
import PowerBar from "./PowerBar.vue";

// eslint-disable-next-line no-unused-vars
const correct = require("../assets/correct.mp3");
// eslint-disable-next-line no-unused-vars
const incorrect = require("../assets/incorrect.mp3");
const music = require("../assets/music.mp3");

export default {
  name: 'Quiz',
  components: {
    QuizQuestion,
    PowerBar,
    QuizScore,
  },
  props: ["players", "options", "volume", "currentQuestion"],
  data() {
    return {
      timePerQ: 10,
      timer: 10,
      timerInstance: null,

      currQuestion: 0,
      answered: false,
      doublePoints: false,
      resetNeeded: false,

      results: null,

      //QuizScore
      verdict: "",
      questionScore: 0,
      scoreStreak: 0,      
    }
  },
  methods: {
    // Event handlers //

    // Handles click of an answer
    onAnswerQuestion(answer) {
      //this.answered = true
      this.$socket.emit('onAnswer', answer);
    },

    // This function is responsible for Handling the power abilities
    onPower(power) {

      switch (power) {
        case 'doublep':
          this.doublePoints = true
          break;

        case '50/50':
          //call the first childs (which is the QuizQuestion.vue file) disableButtons method
          this.$children[0].disableButtons(this.quiz[this.currQuestion]["answer"]);
          this.resetNeeded = true
          break;
      }
    },

    // Normal methods
    nextQuestion(){
      if(this.answered == false){
        this.scoreStreak = 0
      }
      else {
        this.resetNeeded = false
      }
      this.answered = false


      if(this.currQuestion + 1 > this.quiz.length - 1) {
        this.endQuiz();
      }
      else {
        this.currQuestion++
      }
    },
    endQuiz() {
      if(this.options.includes("music")){
        this.musicAudio.pause()
      }
      clearInterval(this.timerInstance)
      this.$emit('done')
    },
    playSound (src) {
      if(src == music){
          this.musicAudio = new Audio();
          this.musicAudio.src = src;
          this.musicAudio.loop = true
          this.musicAudio.volume = 0.001 * this.volume[0]
          this.musicAudio.load();
          this.musicAudio.play()
      }
      else{
        this.sound = new Audio();
        this.sound.src = src;
        this.sound.volume = 0.005 * this.volume[1]
        this.sound.load();
        this.sound.play()
          .then(() => {
            // Audio is playing.
          })
          .catch(error => {
          console.log  (error);
          });
        }
      },
      startTimer() {
        clearInterval(this.timerInstance)
        
        this.timerInstance = window.setInterval(() => {
          if(this.timer-- == 1) {
            this.answered = true;
            clearInterval(this.timerInstance)
          }
        }, 1000)
      }
  },
  mounted() {
    this.startTimer()
  },
  sockets: {
    onNextQuestion: function(question){
      this.currentQuestion = question
      this.timer = 10;
      this.answered = false;

      this.startTimer()
    },
  }
  /*
  mounted() {
    // TODO: Populate quiz questions from DB
    //reset all the powers
    this.$children[1].resetButtons()

    if(this.options.includes("music")){
      this.playSound(music)
    }
    this.timerInstance = window.setInterval(() => {
      if(this.timer-- == 0) {
        this.nextQuestion()
        this.doublePoints = false
        this.timer = this.timePerQ
        if (this.resetNeeded) { // If the user hasn't answered but used the 50/50
          this.$children[0].resetButtons()
          this.resetNeeded = false
        }
      }
    }, 1000000)
  }*/
}
</script>

<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.cont {
  background:#fff;
  padding:100px;
  padding-top:0;
  border-radius:10px;
}

.timer {
  background-color: #fff;
  border-radius:10px;
  padding:10px;
  font-size:220%;
  min-width: 10vh;
  margin-bottom:0;
}

.powers {
  background-color: #fff;
  border-radius:10px;
  padding:5px;
  min-width: 10vh;
  margin-bottom:0;
}

.license{
  position: absolute;
  display: fixed;
  bottom: 0;
}

@media (max-width: 768px) {

}

</style>
