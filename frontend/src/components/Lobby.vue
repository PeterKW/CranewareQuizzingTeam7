<template>
  <b-container fluid>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <h2 class="display-1 col-md-12 text-responsive">Lobby - {{gamePin}}</h2>

    <b-row align-v="center" align-h="center">
      <div class="players col-10 col-sm-8 col-md-6 col-lg-4 col-xl-4">
        <h2>Players</h2>
        <h4 v-for="player in players" :key="player.socket">{{player.username}}</h4>
      </div>
    </b-row>
    <b-row align-h="center">
      <b-button
        @click="onLobbyStart"
        variant="primary"
        class="btn-block button-style col-9 col-sm-7 col-md-4 col-lg-3 col-xl-3"
        style="bottom:80px"
      >
        Start Game
      </b-button>
    </b-row>
    <b-row align-h="center">
      <b-button
        @click="onLobbyExit"
        variant="danger"
        class="btn-block button-style col-9 col-sm-7 col-md-4 col-lg-3 col-xl-3"
        style="bottom:40px"
      >
        Exit Lobby
      </b-button>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "Lobby",
  props: ["players", "gamePin"],
  methods: {
    onLobbyStart(){
      this.$emit('onLobbyStart', this.gamePin);
    },
    onLobbyExit(){
      this.$emit('onLobbyExit', this.gamePin);
    }
  }
};
</script>

<style scoped>
.display-1 {
  text-align: center;
  color: azure;
}
.main-form {
  width: 20vw;
  padding-top: 10%;
}

.text-responsive {
  font-size: calc(100% + 2vw + 2vh);
}

.players {
  background-color: #fff; /* Fallback color */
  color: #000;
  border-radius:10px;
  font-weight: bold;
  text-align: center;
  border: 2px solid #f1f1f1;
  position: absolute;
  width: 100%;
  padding: 20px;
  top: 20%;
}

.button-style {
  width: 100%;
  position: absolute;
}
</style>
