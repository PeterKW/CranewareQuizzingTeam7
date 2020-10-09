<template>
  <div class="cont">
    <b-row class="text-center w-100">
      <h1 class="question w-100">{{verdict}}</h1>
      <h2 class="w-100">You scored {{score}} points.</h2>
      <h3 v-if="scoreStreak > 1" class="w-100">Score Streak: {{scoreStreak}} {{scoreBonus}}</h3>
      <h3 class="w-100">Waiting for next question...</h3>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'QuizScore',
  props: [
      "verdict","score", "scoreStreak"
  ],
  data: function () {
     return {
       scoreBonus: '(+' + 100 * this.scoreStreak + ')'
     }
  }
}
</script>

<style scoped>
h1,h2,h3{padding:10px;}
.cont{padding-bottom: 10px}
</style>
