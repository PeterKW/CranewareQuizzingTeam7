<template>
  <b-container fluid>
     <b-row class="h-100 align-items-center">
        <b-col cols="10" class="mx-auto text-center p4">
          <b-row class="text-center">
            <h1 class="display-1 text-responsive w-100">{{q.text}}</h1>
          </b-row>
          <b-row style="margin-bottom:10px">
            <b-col><b-button class="quizButtons">{{answer.A}}</b-button></b-col>
            <b-col><b-button class="quizButtons">{{answer.B}}</b-button></b-col>
          </b-row>
          <b-row>
            <b-col><b-button class="quizButtons">{{answer.C}}</b-button></b-col>
            <b-col><b-button class="quizButtons">{{answer.D}}</b-button></b-col>
          </b-row>
      </b-col>      
    </b-row>
  </b-container>
</template>

<script>

export default {
  name: 'Quiz',
  data() {

    var choices = ["Choice1", "Choice2", "Choice3", "Choice4"];

    return {
      q: {text: 'Question'},
      answer: {A: choices[0], B: choices[1], C: choices[2], D: choices[3]}
    }
  }
}
</script>

<style scoped>

h1 {
  text-align: center;
  top:150px;
  color: white
}

.quizButtons{
  width:100%;
  height:100%;
  padding: 3vh 5vw;
  font-size: 250%;
  background: -webkit-linear-gradient(#4b6cb7 0%, #182848 100%);
}

@media (max-width: 768px) {

}

</style>
