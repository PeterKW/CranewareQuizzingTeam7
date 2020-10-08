<template>
  <b-container fluid>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <h2 class="display-1 col-md-12 text-responsive">Leaderboard</h2>

    <b-row align-v="center" align-h="center">
      <div class="players col-10 col-sm-8 col-md-6 col-lg-6 col-xl-4 mh-50">
        <table class="table table-hover ">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Username</th>
              <th scope="col">Points</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Daniel</td>
              <td>53</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Andrew</td>
              <td>27</td>
            </tr>
            <tr>
              <th scope="row">3</th>
              <td>Dancho</td>
              <td>24</td>
            </tr>
            <tr>
              <th scope="row">4</th>
              <td>Archie</td>
              <td>21</td>
            </tr>
            <tr>
              <th scope="row">5</th>
              <td>Finn</td>
              <td>5</td>
            </tr>
          </tbody>
        </table>
      </div>
    </b-row>
    <b-row align-h="center">
      <b-button
        variant="primary"
        class="btn-block button-style col-9 col-sm-7 col-md-4 col-lg-3 col-xl-3"
      >
        Return to Menu
      </b-button>
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

.text-responsive {
  font-size: calc(100% + 4vw + 4vh);
}

.button-style {
  width: 100%;
  position: absolute;
  bottom: 40px;
}

.table {
  color: white;
}

@media (min-width: 241px) and (max-width: 500px) {
  .players {
    top: 25vw;
  }
}
</style>
