<template>
    <b-container fluid>
      <b-row class="h-100 align-items-center">
          <b-col xl="5" lg="6" md="8" sm="10" class="mx-auto text-center p4 cont">
               <b-row class="justify-content-center">
                  <h1 class="text-responsive">Cranehoot</h1>
              </b-row>
                <b-form class="justify-content-center">
                    <b-form-group>
                        <label class="sr-only">Username</label>
                        <b-form-input size="lg"
                          v-model="username"
                          class="align-items-center"
                          type="text"
                          placeholder="USERNAME"
                          maxlength="10"
                        />
                    </b-form-group>
                    <b-form-group>
                        <label class="sr-only">Game Pin</label>
                        <b-form-input size="lg"
                          v-model="gamePin"
                          type="text"
                          placeholder="GAME PIN"
                          maxlength="8"
                        />
                    </b-form-group>
                    <div class="btn-group d-flex" role="group">
                      <b-button @click="onJoinLobby" variant="primary" class="button_base b09_electric">
                        Join
                      </b-button>
                    </div>
                    <p class="m-0">-or-</p>
                    <div class="btn-group d-flex" role="group">
                      <b-button @click="onFindLobby" variant="primary" class="button_base b09_electric">
                        Find Lobby
                      </b-button>
                      <b-button @click="onCreateLobby" variant="primary" class="button_base b09_electric">
                        Create Lobby
                      </b-button>
                    </div>
                  <div>
                    <b-button style="margin-top:10px" id="show-btn" variant="primary" class="button_base b09_electric" @click="$bvModal.show('bv-modal')">Settings</b-button>

                    <!--Settings Modal-->
                    <b-modal id="bv-modal" hide-footer>
                      <template v-slot:modal-title>
                        <code>Settings</code>
                      </template>
                          <b-form-group label="Audio">
                            <b-row>
                              <b-col>
                                <b-form-checkbox-group
                                    v-model="selected"
                                    :options="options"
                                    switches
                                    stacked
                                    v-on:input="updateSettings"
                                ></b-form-checkbox-group>
                              </b-col>

                              <b-col style="margin-top:10px">
                                <vue-slider v-model="musicVolume" :disabled="!this.selected.includes('music') "  @change="updateVolume"></vue-slider>
                                <hr>
                                <vue-slider v-model="effectsVolume" :disabled="!this.selected.includes('effect')"  @change="updateVolume"></vue-slider>
                              </b-col>

                            </b-row>
                          </b-form-group>
                             <b-form-group label="Background Speed">
                              <vue-slider v-model="sliderValue"  @change="updateBackground"></vue-slider>
                            </b-form-group>
                      <b-button class="mt-3" block @click="$bvModal.hide('bv-modal')">Close</b-button>
                    </b-modal>
                  </div>
                </b-form>
          </b-col>
      </b-row>
    </b-container>
</template>

<!--Pusher Event Handler-->
<script src="https://js.pusher.com/7.0/pusher.min.js"></script>

<script>
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'
export default {
  name: 'Index',
  data: function() {
    return {
      username: "",
      gamePin: "",
      sliderValue: 50,
      musicVolume: 50,
      effectsVolume: 50,
      selected: ["music", "effect", "vibration"],
      options: [
        { text: 'Music', value: 'music' },
        { text: 'Vibrations', value: 'vibration', disabled: !"vibrate" in navigator},
        { text: 'Sound Effects', value: 'effect' },
      ],
    }
  },
  components: {
    VueSlider
  },
  methods: {
    onJoinLobby() {
      this.$emit('onJoinLobby', this.username, this.gamePin)
    },
    onFindLobby() {
      this.$emit('onFindLobby', this.username)
    },
    onCreateLobby() {
      // TODO: Make a proper error message
      if(!this.username){ alert("Enter a username"); return;}

      this.$emit('onCreateLobby', this.username);
    },
    updateBackground() {
      this.$emit('updateBackground', this.sliderValue)
    },
    updateSettings(){
      this.$emit('updateSettings', this.selected)
    },
    updateVolume(){
      this.volume = [this.musicVolume, this.effectsVolume]
      this.$emit('updateVolume', this.volume)
    }
  },
  mounted() {
    this.updateSettings()
    this.updateVolume()
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
  font-size:550%;
  font-family: 'Source Sans Pro', sans-serif;
  color: #000;
  padding-bottom: 30px;
  margin: 0 auto
}

.main-form {
  width: 30vw;
  padding-top: 45vh;
}

.cont {
  background:#fff;
  padding:50px;
  padding-top:0;
  border-radius:20px;
}

.text-responsive{
  text-align: center;
  font-size: calc(100% + 4vw + 4vh);
}
</style>
