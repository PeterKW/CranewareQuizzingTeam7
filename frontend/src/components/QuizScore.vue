<template>
  <div class="cont">
    <b-row class="text-center w-100">
      <h1 class="question w-100">{{verdict}}</h1>
      <h2 class="w-100">You scored {{score}} points.</h2>
      <h5 class="w-100" style="padding-bottom: 0px" v-for="messages in target_message" v-bind:key="messages.message">{{messages.message}}</h5>
      <h3 class="w-100" style="padding-bottom: 0px" v-if="countering && target_message.length >= 1">You countered!</h3>
      <h3 class="w-100" style="padding-bottom: 0px" v-if="countering && target_message.length == 0">You countered no one! Your next points will be halved.</h3>
      <h3 v-if="scoreStreak > 1" class="w-100">Score Streak: {{scoreStreak}} {{scoreBonus}}</h3>

     <table class="table table-hover ">
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
  props: [
      "verdict","score", "scoreStreak", "leaderboard", "countering", "target_message"
  ],
  data: function () {
     return {
       scoreBonus: '(+' + 100 * this.scoreStreak + ')',
       ID: 'QuizScore',
     }
  },

  methods: {

    add_message(message) {
      this.notifications.push(message)
    },

    clear_messages() {
      this.notifications = []
    }
  }
}
</script>

<style scoped>
h1,h2,h3,h5{padding:10px;}
.cont{padding-bottom: 10px}
</style>
