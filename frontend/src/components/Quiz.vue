<template>
  <b-container fluid>
     <b-row class="h-100">
        <b-col cols="10" class="mx-auto text-center p4">
          <b-row class="w-100" style="margin-bottom: 5px;">
            <p class="currPlayers mr-auto">Players: {{currPlayers}}</p>
            <p class="timer ml-auto">{{timer}}</p>
          </b-row>
          <QuizQuestion v-if="!answered" v-on:answer="onAnswerQuestion" :question="currentQuestion['@question_content']" :a="currentQuestion['@answer1']" :b="currentQuestion['@answer2']" :c="currentQuestion['@answer3']" :d="currentQuestion['@answer4']"/>
          <PowerBar class="powers" v-if="!answered" v-on:power="onPower" :round="round" :players="players"/>
          <div v-if="answered && !results" class="cont">
            <b-row class="justify-content-center w-100">
              <h1 class="text-center question w-100" style="padding-top:60px">Waiting for results...</h1>
            </b-row>
          </div>

          <QuizScore v-if="results" :verdict="verdict" :score="questionScore" :scoreStreak="scoreStreak" :leaderboard="leaderboard" :correctAnswer="correctAnswer" :countered="countering" :target_message="target_message"/>

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
  props: ["players", "options", "volume", "currentQuestion", "currentPlayer", "gamePin"],
  data() {
    return {
      timePerQ: 10,
      timer: 10,
      timerInstance: null,

      leaderboard: [],
      round: 0,
      currQuestion: 0,
      answered: false,
      doublePoints: false,
      resetNeeded: false,
      quizRef: null,
      quizScore: null,
      target: null,
      targetted: false,
      targetees: [],
      target_message: [],
      halfNextAnswer: false,
      countering: false,

      currPlayers: 0,

      results: null,

      //QuizScore
      verdict: "",
      questionScore: 0,
      scoreStreak: 0,
      correctAnswer: ""
    }
  },
  methods: {
    // Event handlers //

    // Handles click of an answer
    onAnswerQuestion(answer) {
      this.answered = true

      this.$socket.emit('onAnswer', answer, this.doublePoints, this.halfNextAnswer, this.gamePin);
      this.doublePoints = false;

       /*
        // TODO: Send correct data at this point.
        // this.$emit('calculatePoints', this.gamePin, this.questionScore);
      */
    },

    // This function is responsible for Handling the power abilities
    onPower(power) {

      switch (power) {
        case 'doublep':
          this.doublePoints = true
          break;

        case '50/50':
          //call the QuizQuestion.vue files disableButtons method
          this.quizRef.disableButtons(this.currentQuestion['@correct_answer']);
          this.resetNeeded = true;
          break;

        case 'half':
          for (var i = 0; i < this.$children.length; i++) {
            if (this.$children[i].ID == 'PowerBar') {
              var target = this.$children[i].playerChoice[0];
            }
          }
          console.log(this.currentPlayer);
          console.log(target);
          this.$socket.emit('attackPlayer', this.gamePin, target, this.currentPlayer);
          break;

        case 'counter':
          this.quizRef.disableButtons(this.currentQuestion['@correct_answer']);
          break;
      }
    },

    // Normal methods
    nextQuestion() {
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
    add_message(notification){
      this.target_message.push( {message : notification});
    },
    reset_message(){
      this.target_message = []
    },
    soundAndVibrations(){
      if(this.verdict == "Correct!"){
        if(this.options != null){
          if(this.options.includes("vibration")){
            if (navigator.vibrate) {
              // vibration API supported
              window.navigator.vibrate(500);
            }
          }
          if(this.options.includes("effect")){
            this.playSound(correct)
          }
        }
      }
      else {
        if(this.options != null)
          if(this.options.includes("effect"))
            this.playSound(incorrect)
      }
    }
  },
  sockets: {

    incorrectlyTargetted: function () {
      //this.halfNextAnswer = false
      this.reset_message();
      //for (var i = 0; i < this.targetees.length; i++) {
      //  this.$socket.emit('punishPlayer' ,this.gamePin, this.targetees[i]);
      //}
    },

    playerIncorrectlyHalved: function() {
      if (this.answered) {
        this.$socket.emit('updateScore' ,this.gamePin, this.currentPlayer);
      } else {
        this.halfNextAnswer = true;
      }
      this.add_message("You incorrectly halfed, and now your score has been halfed");
    },

    playerTargetted: function(targetee) {
      this.targetees.push(targetee);
      this.add_message("You were targetted, your score has been halfed!");
      if (this.answered && this.answered == this.currentQuestion['@correct_answer']) {
        this.$socket.emit('updateScore' ,this.gamePin, this.currentPlayer);
      } else if (this.answered) {
        this.$socket.emit('punishPlayer', this.gamePin, targetee);
      } else {
        this.targetted = true;
        this.halfNextAnswer = true;
      }
    },

    incorrectlyDoubled: function () {
      this.add_message("You failed after using the Double Points! -500 points for you.");
    },

    onNextQuestion: function(question){
      this.answered = false;
      this.results = false;

      if (!this.halfNextAnswer) {
        this.reset_message()
      }

      this.currentQuestion = question

      for (var i = 0; i < this.$children.length; i++) {
        if (this.$children[i].ID == 'QuizQuestion') {
            this.quizRef = this.$children[i];
        }
      }

      this.timer = 10;
      // this.$socket.emit('currPlayers', {});

      this.round++
    },
    resetHalf: function() {
      this.halfNextAnswer = false;
    },
    onResults: function(results){
      this.results = true
      this.verdict = results.verdict

      this.soundAndVibrations()

      this.questionScore = results.score
      this.scoreStreak = results.streak
      this.leaderboard = results.playerScores
      this.correctAnswer = results.correctAnswer
    },
    onTimerTick(time) {
      this.timer = time

      if(this.timer == 0) {
        this.answered = true;
      }
    },
    onTimerTick2(time) {
      this.timer = time

      if(this.timer == 0) {
        this.answered = false;
        this.results = false;
      }
    },
    onQuizEnd: function(leaderboard){
      if(this.options.includes("music")){
        this.musicAudio.pause()
      }

      this.$emit('done', leaderboard)
    },
    onPlayerDisconnected: function () {
      this.currPlayers -= 1;
    },
    onCurrentPlayers: function (num){
      this.currPlayers = num;
    }
  },

  mounted() {
    // TODO: Populate quiz questions from DB
    //reset all the powers
    this.$children[1].resetButtons();
    for (var i = 0; i < this.$children.length; i++) {
      if (this.$children[i].ID == 'QuizQuestion') {
          this.quizRef = this.$children[i];
      }
    }

    this.$socket.emit('getCurrPlayers', {});

    if(this.options.includes("music")){
      this.playSound(music)
    }
  }
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
  padding:50px;
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

.currPlayers {
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
  padding:15px;
  margin-bottom:0;
}

.license{
  position: absolute;
  display: fixed;
  bottom: 0;
}

@media (max-width: 768px) {
  .timer{
    font-size: 175%;
  }

  .currPlayers{
    font-size: 175%;
  }

  .question{
    font-size: 175%;
  }

  .cont {
    padding-bottom: 20px;
  }

  .powers{
    padding: 0px;
    min-width: 20%;
    max-height: 0vh;
  }

}

</style>
