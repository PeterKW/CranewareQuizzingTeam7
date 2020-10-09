<template>
    <b-container fluid>
      <b-row class="h-100 align-items-center">
          <b-col xl="5" lg="6" md="8" sm="10" class="mx-auto text-center p4 cont">
               <b-row class="text-center">
                  <h1 class="text-responsive w-100">Cranehoot</h1>
              </b-row>
              <div class="px-5">
                <b-form class="justify-content-center">
                    <b-form-group>
                        <label class="sr-only">Username</label>
                        <b-form-input size="lg"
                          class="align-items-center"
                          type="text"
                          placeholder="USERNAME"
                          maxlength="10"
                        />
                    </b-form-group>
                    <b-form-group>
                        <label class="sr-only">Game Pin</label>
                        <b-form-input size="lg"
                          type="text"
                          placeholder="GAME PIN"
                          maxlength="8"
                        />
                    </b-form-group>
                    <div class="btn-group d-flex" role="group">
                      <b-button @click="join('single')" variant="primary" class="button_base b09_electric" onclick="createLobby(false)">
                        Start
                      </b-button>
                    </div>
                    <p class="m-0">-or-</p>
                    <div class="btn-group d-flex" role="group">
                      <b-button variant="primary" class="button_base b09_electric">
                        Search for Lobby
                      </b-button>
                      <b-button variant="primary" class="button_base b09_electric" onclick="createLobby(true)">
                        Create Lobby
                      </b-button>
                    </div>
                </b-form>
            </div>
          </b-col>
      </b-row>
    </b-container>
</template>

<!--Pusher Event Handler-->
<script src="https://js.pusher.com/7.0/pusher.min.js"></script>

<script>
export default {
  name: 'Index',
  methods: {
    join(type) {
      this.$emit('join', type);
    }
  }
}

// Logs all network communication information to console
Pusher.logToConsole = true;

// Instantiates a Pusher connection.
const pusher = new Pusher('072127b07acd646fc5ec',
{
  cluster: 'eu',
  useTLS: true,
  authEndpoint: 'http://localhost:5000/pusher/auth'
});

// Subscribes to the private lobby channel
const evntReader = pusher.subscribe('private-lobby');

// Is the function called whenever the my-event event occurs
evntReader.bind('my-event', function(data){
  alert('An event was triggered with message: ' + data.message);
});

// Will send an event to create a server connection, that is either multiplayer or singleplayer
// isMultiplayer - bool - determines if the game is multiplayer or not
function createLobby(isMultiplayer)
{
  if(isMultiplayer)
  {
    // Sends multiplayer event to server
    evntReader.trigger('client-create lobby',
      {
        'message': 'create multiplayer lobby',
      });
  }
  else
  {
    // Sends singleplayer event to server
    evntReader.trigger('client-create lobby',
      {
        'message': 'create singleplayer lobby',
      });
  }
}

// Sends data about the chosen answer.
function selectAnswer(choice)
{
  evntReader.trigger('client-choose answer',
    {
      'message': choice,
    });
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
}

.main-form {
  width: 20vw;
  padding-top: 45vh;
}

.cont {
  background:#fff;
  padding:100px;
  padding-top:0;
  border-radius:20px;
}
</style>
