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
    </b-row>
  </b-container>
</template>

<script>
import QuizQuestion from "./QuizQuestion.vue";
import QuizScore from "./QuizScore.vue";

export default {
  name: 'Quiz',
  components: {
    QuizQuestion,
    QuizScore
  },
  props: ["players"],
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
      this.$emit('done');
    },

    onAnswerQuestion(answer) {
      this.answered = true

      // TODO: This will go server side in the future
      if(this.quiz[this.currQuestion]["answer"] == answer){
        this.verdict = "Correct!"

        this.scoreStreak = this.scoreStreak + 1;
        this.questionScore = this.timer * 100;
        if(this.scoreStreak > 1){
          this.questionScore = this.questionScore * this.scoreStreak;
        }
        this.players[0].score += this.questionScore;
        
      }
      else {
        this.verdict = "Incorrect!"
        this.questionScore = 0;
        this.scoreStreak = 0;
      }
    }
  },
  mounted() {
    // TODO: Populate quiz questions from DB

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

@media (max-width: 768px) {

}

</style>
