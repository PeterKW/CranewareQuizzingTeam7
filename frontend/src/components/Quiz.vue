<template>
  <b-container fluid>
    <h1 class="display-1 col-md-12 text-responsive">{{q.text}}</h1>

      <div class="d-flex justify-content-center">
        <b-row class="d-flex justify-content-center">

          <b-button variant="outline-secondary" class="quiz_buttons">
                {{answer.A}}
          </b-button>
            <div class="divider"/>
          <b-button variant="outline-secondary" class="quiz_buttons">
                {{answer.B}}
          </b-button>
        </b-row>
      </div>
      <div class="d-flex justify-content-center">
        <b-row class="d-flex justify-content-center">
          <b-button variant="outline-secondary" class="quiz_buttons">
                {{answer.C}}
          </b-button>
            <div class="divider"/>
          <b-button variant="outline-secondary" class="quiz_buttons">
                {{answer.D}}
          </b-button>

        </b-row>
      </div>
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

.divider{
    width:10px;
    height:auto;
    display:inline-block;
}


.quiz_buttons{
  background: -webkit-linear-gradient(#4b6cb7 0%, #182848 100%);
  padding: 75px 200px;
  font-size: 32px;
  position:relative;
  top:300px;
  margin-bottom:10px

}

</style>
