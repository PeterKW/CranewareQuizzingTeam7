<template>
    <b-container fluid>
      <b-row class="h-100 align-items-center">
          <b-col xl="5" lg="6" md="8" sm="10" class="mx-auto text-center p4">
              <h1 class="display-1 text-responsive">Cranehoot</h1>
              <div class="px-5">
                <b-form class="justify-content-center">
                    <b-form-group>
                        <b-label class="sr-only">Username</b-label>
                        <b-form-input size="lg"
                          class="align-items-center"
                          type="text"
                          placeholder="USERNAME"
                          maxlength="10"
                        />
                    </b-form-group>
                    <b-form-group>
                        <b-label class="sr-only">Game Pin</b-label>
                        <b-form-input size="lg"
                          type="text"
                          placeholder="GAME PIN"
                          maxlength="8"
                        />
                    </b-form-group>
                    <div class="btn-group d-flex" role="group">
                    <b-button @click="join('single')" variant="primary" class="button_base b09_electric">
                      Single Player
                    </b-button>
                    <b-button variant="primary" class="button_base b09_electric">
                      Join Lobby
                    </b-button>
                    <b-button variant="primary" class="button_base b09_electric" >
                      Create Lobby
                    </b-button>
                  </div>
                </b-form>
            </div>
          </b-col>
      </b-row>
    </b-container>
</template>

<script>
export default {
  name: 'Index',
  methods: {
    join(type) {
      this.$emit('join', type);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.b09_electric {
    color: #000000;
    background-color: #ffffff;
    border: #000000 solid 1px;
    padding: 10px;
    transition: all 0.1s ease;
    -webkit-transition: all 0.1s ease;
    -moz-transition: all 0.1s ease;
}

.b09_electric:hover {
    color: #ffffff;
    background-color: #000000;
    animation: b09_electric_blinkIn 0.1s step-end 0 2;
    -webkit-animation: b09_electric_blinkIn 0.1s step-end 0 2;
    -moz-animation: b09_electric_blinkIn 0.1s step-end 0 2;
    transition: all 0.2s ease 0.2s;
    -webkit-transition: all 0.2s ease 0.2s;
    -moz-transition: all 0.2s ease 0.2s;
}

@-webkit-keyframes b09_electric_blinkIn {
    from,
    to {
        background-color: #f8f8f8;
        color: #080808;
    }
    50% {
        background-color: #ffffff;
        color: #000000;
    }
}

@-moz-keyframes b09_electric_blinkIn {
    from,
    to {
        background-color: #f8f8f8;
        color: #080808;
    }
    50% {
        background-color: #ffffff;
        color: #000000;
    }
}


h1 {
  text-align: center;
  top:30vh;
  font-family: "Courier New", Courier, monospace;
  color: white
}

.display-1 {
  text-align: center;
  color: azure;
}
.main-form {
  width: 20vw;
  padding-top: 45vh;
}
</style>
