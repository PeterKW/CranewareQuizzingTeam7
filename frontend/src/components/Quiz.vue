<template>
  <b-container fluid>
     <b-row class="h-100 align-items-center">
        <b-col cols="10" class="mx-auto text-center p4">
          <b-row class="w-100" style="margin-bottom: 5px;">
            <p class="timer ml-auto">{{timer}}</p>
          </b-row>
          <QuizQuestion :question="quiz[currQuestion].question" :a="quiz[currQuestion].A" :b="quiz[currQuestion].B" :c="quiz[currQuestion].C" :d="quiz[currQuestion].D"/>
      </b-col>      
    </b-row>
  </b-container>
</template>

<script>
import QuizQuestion from "./QuizQuestion.vue";

export default {
  name: 'Quiz',
  components: {
    QuizQuestion
  },
  data() {
    return {
      timePerQ: 10,
      timer: 10,
      timerInstance: null,
      currQuestion: 0,
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
    }
  },
  mounted() {
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
