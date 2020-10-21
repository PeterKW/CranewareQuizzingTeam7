<template>
  <div class="cont justify-content-center">
    <b-row class="text-center w-100">
      <h1 class="question w-100">{{verdict}}</h1>
      <h2 class="w-100">You scored {{score}} points.</h2>
      <h3 v-if="scoreStreak > 1" class="w-100">Score Streak: {{scoreStreak}} {{scoreBonus}}</h3>

     <table class="table table-hover justify-items-center">
        <thead>
          <tr>
            <th scope="col">Username</th>
            <th scope="col">Points</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="player in leaderboard" :key="player.socket">
            <td>{{player.username}}</td>
            <td>{{player.score}}</td>
          </tr>
        </tbody>
      </table>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'QuizScore',
  props: [
      "verdict","score", "scoreStreak", "leaderboard"
  ],
  data: function () {
     return {
       scoreBonus: '(+' + 100 * this.scoreStreak + ')'
     }
  }
}
</script>

<style scoped>
h1,h2,h3{padding:10px; text-align: center;}
h2{font-size: 200%;}
.cont{
  padding-bottom: 10px;
  text-align: center}
  

@media (max-width: 768px) {
  h2{font-size: 150%;}
  h3{font-size: 100%;}
}
</style>
