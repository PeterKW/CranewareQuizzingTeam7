<template>
  <b-container fluid>
     <b-row class="h-100 align-items-center">
        <b-col cols="10" class="mx-auto text-center p4">
          <b-row class="w-100" style="margin-bottom: 5px;">
            <p class="timer ml-auto">{{timer}}</p>
          </b-row>
          
          <QuizQuestion v-if="!answered" v-on:answer="onAnswerQuestion" :question="quiz[currQuestion].question" :a="quiz[currQuestion].A" :b="quiz[currQuestion].B" :c="quiz[currQuestion].C" :d="quiz[currQuestion].D"/>

          <QuizScore v-if="answered" :verdict="verdict" :score="questionScore" :scoreStreak="scoreStreak"/>
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
const correct = require("../assets/correct.mp3");
const incorrect = require("../assets/incorrect.mp3");
const music = require("../assets/music.mp3");


export default {
  name: 'Quiz',
  components: {
    QuizQuestion,
    QuizScore
  },
  props: ["players", "options"],
  data() {
    return {
      timePerQ: 10,
      timer: 10,
      timerInstance: null,
      currQuestion: 0,
      answered: false,
  
      //QuizScore
      verdict: "",
      questionScore: 0,
      scoreStreak: 0,

      // TODO: This will be recieved from the websocket per question later on
      quiz: [
        {
          "question":"How many teeth does an adult human have?",
          "answer": "A",
          "A": "32",
          "B": "30",
          "C": "25",
          "D": "20"
        },
        {
          "question":"What is the largest bird of prey in the world?",
          "answer": "B",
          "A": "Golden Eagle",
          "B": "Andean Condor",
          "C": "Sparrow Hawk",
          "D": "Peregrine Falcon"
        },
        {
          "question":"In which sport would you use a shuttlecock?",
          "answer": "C",
          "A": "Hockey",
          "B": "Tennis",
          "C": "Badminton",
          "D": "Football"
        },
        {
          "question":"What is the biggest state in America?",
          "answer": "B",
          "A": "North Carolina",
          "B": "Alaska",
          "C": "Colarado",
          "D": "Washington"
        },
        {
          "question":"What is a group of lions called?",
          "answer": "A",
          "A": "Pride",
          "B": "Gaggle",
          "C": "Murder",
          "D": "Herd"
        },
      ]
    }
  },
  methods: {
    nextQuestion(){
      if(this.answered == false){
        this.scoreStreak = 0;
      }
      this.answered = false
      

      if(this.currQuestion + 1 > this.quiz.length - 1) {
        this.endQuiz()
      }
      else {
        this.currQuestion++
      }
    },

    endQuiz() {
      clearInterval(this.timerInstance);
      if(this.options.includes("music")){
        this.musicAudio.pause()
      }
      
      this.$emit('done');
    },

    onAnswerQuestion(answer) {
      this.answered = true

      /*
      // Send answer to Pusher
      eventReader.trigger('client-choose answer',
      {
        'message': answer,
      });*/

      
      // TODO: This will go server side in the future
      if(this.quiz[this.currQuestion]["answer"] == answer){
        this.verdict = "Correct!"
        
        this.scoreStreak = this.scoreStreak + 1;
        this.questionScore = this.timer * 100;
        if(this.scoreStreak > 1){
          this.questionScore = this.questionScore + (100 * this.scoreStreak);
        }
        this.players[0].score += this.questionScore;

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
        this.verdict = "Incorrect!"
        this.questionScore = 0;
        this.scoreStreak = 0;
      }
    },

    playSound (src) {
      if(src == music){
          this.musicAudio = new Audio();
          this.musicAudio.src = src;
          this.musicAudio.loop = true
          this.musicAudio.volume = 0.1
          this.musicAudio.load();
          this.musicAudio.play()
      }
      else{
        this.sound = new Audio();
        this.sound.src = src;
        this.sound.load();
        this.sound.play()
          .then(() => {
            // Audio is playing.
          })
          .catch(error => {
          console.log  (error);
          });
        } 
      }

  },
  mounted() {
    // TODO: Populate quiz questions from DB
    if(this.options.includes("music")){
      this.playSound(music)
    }
      
    this.timerInstance = window.setInterval(() => {
      if(this.timer-- == 0) {
        this.nextQuestion()
        this.timer = this.timePerQ;
      }
    }, 1000)
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

.license{
  position: absolute;
  display: fixed;
  bottom: 0;
}

@media (max-width: 768px) {

}

</style>
