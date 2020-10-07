<template>
  <b-container fluid>
    <h1 class="display-1 col-md-12 text-responsive">{{q.text}}</h1>

      <div class="d-flex justify-content-center">
        <b-row class="d-flex justify-content-center">
          <b-button variant="outline-secondary">
                {{answer.A}}
          </b-button>
          <b-button variant="outline-secondary">
                {{answer.B}}
          </b-button>
        </b-row>
        <b-row class="d-flex justify-content-center">
          <b-button variant="outline-secondary">
                {{answer.C}}
          </b-button>
          <b-button variant="outline-secondary">
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
      q: {text: 'question'},
      answer: {A: choices[0], B: choices[1], C: choices[2], D: choices[3]}
    }
  }
}
</script>
