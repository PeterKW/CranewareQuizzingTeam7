<template>
  <b-container fluid>
    <h1 class="display-1 col-md-12 text-responsive">Cranehoot</h1>
    <b-row class="d-flex justify-content-center" style="height: 100px">
      <b-form class="main-form col-10 col-sm-8 col-md-6 col-lg-4 col-xl-3">
        <b-form-group>
          <b-form-input
            size="lg"
            type="text"
            placeholder="USERNAME"
            maxlength="10"
          />
        </b-form-group>
        <b-form-group>
          <b-form-input
            size="lg"
            type="text"
            placeholder="GAME PIN"
            maxlength="8"
          />
        </b-form-group>
        <b-button variant="primary" class="btn-block">
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
  name: "Index",
};
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
