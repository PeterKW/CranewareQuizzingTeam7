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
        style="bottom:80px; background-color: #00688B !important"
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
    <b-row align-h="center">
      <b-button  
        id="show-btn" 
        variant="warning" 
        class="btn-block button-style col-9 col-sm-7 col-md-4 col-lg-3 col-xl-3" 
        style="bottom:120px"
        @click="$bvModal.show('bv-modal')"
      >
        Game Settings
      </b-button>

      <!--Settings Modal-->
      <b-modal id="bv-modal" hide-footer>
        <template v-slot:modal-title>
          <code>Game Settings</code>
        </template>
        
        <div>
          <label for="category" class="mt-3">Selected Categories</label>
          <b-dropdown id="category" text="Add or Remove" variant="outline-dark" block>
            <b-dropdown-item v-for="item in categories" :key="item" @click.native="itemClicked(item)">
              {{ item }}
            </b-dropdown-item>
          </b-dropdown>
        </div>

        <div>
          <b-badge v-for="badge in selectedCategory" :key="badge" class="mr-2 mt-2" pill variant="dark" size="lg" @click.native="removeItem(item)">
            {{ badge }}
          </b-badge>
        </div>

        <div>
          <label for="time" class="mt-3">Time per Question</label>
          <b-form-spinbutton id="time" v-model="questionTime" min="5" max="60"></b-form-spinbutton>
        </div>

        <div>
          <label for="number" class="mt-3">Number of Questions</label>
          <b-form-spinbutton id="number" v-model="questionNumber" min="1" max="100"></b-form-spinbutton>
        </div>

        <b-button class="mt-4" variant="danger" block @click="$bvModal.hide('bv-modal')">Close</b-button>
      </b-modal>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: "Lobby",
  props: ["players", "gamePin"],
  data: function() 
  {
    return {
      questionTime: 10,
      questionNumber: 10,
      selectedCategory: [],
      categories: [
        "animals",
        "brain-teasers",
        "celebrities",
        "entertainment",
        "for-kids",
        "science-technology",
        "sports",
        "video-games"
      ]
    }
  },
  methods: {
    onLobbyStart(){
      // Number of questions starts at 0 instead if 1
      this.questionNumber--
      this.$emit('onLobbyStart', this.gamePin, this.selectedCategory, this.questionTime, this.questionNumber);
    },
    onLobbyExit(){
      this.$emit('onLobbyExit', this.gamePin);
    },
    itemClicked(item){
      if (!this.selectedCategory.includes(item))
        this.selectedCategory.push(item);
      else
        this.removeItem(item);
      console.log("clicked", this.selectedCategory);
    },
    removeItem(item){
      for( var i = 0; i < this.selectedCategory.length; i++){ 
        if ( this.selectedCategory[i] === item) { 
          this.selectedCategory.splice(i, 1); 
        }
      }
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
