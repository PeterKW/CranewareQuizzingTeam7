<template>
    <b-container fluid>
      <h1 class="display-1 col-md-12 text-responsive">Cranehoot</h1>
      <b-row class="d-flex justify-content-center" style="height: 100px">
        <b-form cols="10" sm="8" md="6" lg="4" xl="2" class="main-form">
          <b-form-group>
            <b-form-input size="lg"
              type="text"
              placeholder="USERNAME"
              maxlength="10"
            />
          </b-form-group>
          <b-form-group>
            <b-form-input size="lg"
              type="text"
              placeholder="GAME PIN"
              maxlength="8"
            />
          </b-form-group>
          <b-button @click="singlePlayer" variant="primary" class="btn-block">
            Single Player
          </b-button>
          <b-button variant="primary" class="btn-block">
            Join Lobby
          </b-button>
          <b-button variant="primary" class="btn-block">
            Create Lobby
          </b-button>
        </b-form>
      </b-row>
    </b-container>
</template>

<script>
export default {
  name: 'Index',
  methods: {
    singlePlayer() {
      this.$emit('join', "single");
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.display-1 {
  text-align: center;
  color: azure;
}
.main-form {
  width: 20vw;
  padding-top: 10%;
}
</style>
