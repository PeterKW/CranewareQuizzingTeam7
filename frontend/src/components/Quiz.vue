<template>
  <b-container fluid>
     <b-row class="h-100 align-items-center">
        <b-col cols="10" class="mx-auto text-center p4">
          <b-row class="w-100" style="margin-bottom: 5px;">
            <p class="timer ml-auto">{{timer}}</p>
          </b-row>
          <div class="cont">
          <b-row class="text-center">
            <h2 class="question w-100">{{quiz[currQuestion].question}}</h2>
          </b-row>
          <b-row style="margin-bottom:10px">
            <b-col style="margin-right:10px;"><b-button class="fancy-btn btn--alpha"><span>{{quiz[currQuestion].A}}</span></b-button></b-col>
            <b-col><b-button class="fancy-btn btn--beta"><span>{{quiz[currQuestion].B}}</span></b-button></b-col>
          </b-row>
          <b-row>
            <b-col style="margin-right:10px;"><b-button class="fancy-btn btn--gamma"><span>{{quiz[currQuestion].C}}</span></b-button></b-col>
            <b-col><b-button class="fancy-btn btn--delta"><span>{{quiz[currQuestion].D}}</span></b-button></b-col>
          </b-row>
          </div>
      </b-col>      
    </b-row>
  </b-container>
</template>

<script>

export default {
  name: 'Quiz',
  data() {
    return {
      timer: 10,
      currQuestion: 0,
      quiz: [
        {
          "question":"How many teeth does an adult human have?",
          "answer": "A",
          "A": "32",
          "B": "30",
          "C": "25",
          "D": "20"
        },
        {
          "question":"What is the largest bird of prey in the world?",
          "answer": "B",
          "A": "Golden Eagle",
          "B": "Andean Condor",
          "C": "Sparrow Hawk",
          "D": "Peregrine Falcon"
        },
        {
          "question":"In which sport would you use a shuttlecock?",
          "answer": "C",
          "A": "Hockey",
          "B": "Tennis",
          "C": "Badminton",
          "D": "Football"
        },
        {
          "question":"What is the biggest state in America?",
          "answer": "B",
          "A": "North Carolina",
          "B": "Alaska",
          "C": "Colarado",
          "D": "Washington"
        },
        {
          "question":"What is a group of lions called?",
          "answer": "A",
          "A": "Pride",
          "B": "Gaggle",
          "C": "Murder",
          "D": "Herd"
        },
      ]
    }
  },
  mounted() {
    window.setInterval(() => {
      if(this.timer-- == 0) {
        alert("times up")
      }
    }, 1000)
  }
}
</script>

<style lang="scss" scoped>
//Taken and modified from: https://codepen.io/CiTA/pen/YBQjVQ
$time: 330ms;

$btns: (
  alpha: (
    gstart: #21D4FD,
    gend: #B721FF,
    tstart: #ffffff,
    tend: #ffffff
  ),
  beta: (
    gstart: #08AEEA,
    gend: #2AF598,
    tstart: #ffffff,
    tend: #ffffff
  ),
  gamma: (
    gstart: #FEE140,
    gend: #FA709A,
    tstart: #ffffff,
    tend: #ffffff
  ),
  delta: (
    gstart: #3EECAC,
    gend: #EE74E1,
    tstart: #ffffff,
    tend: #ffffff
  )
);


* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

html {
  font-size: 20px;
}

body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.fancy-btn {
  font-family: 'Source Sans Pro', sans-serif;
  font-weight: 900;
  padding: 1.25rem 2rem;
  font-size: 1rem;
  border-radius: 3.5rem / 100%;
  position: relative;
  min-width: 15rem;
  max-width: 90vw;
  overflow: hidden;
  border: 0;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all $time;

  width:100%;
  height:100%;
  padding: 3vh 5vw;
  font-size: 250%;
  
  & + & {
    margin-top: 1rem;
  }
  
  span {
    position: relative;
    z-index: 1;
  }
  
  &:before {
    content: "";
    background-color: #21D4FD;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: scale(4) translateX(-100%);
    transition: all $time * 1.5 ease-out;
  }
  
  &:hover,
  &:focus,
  &:active {    
    &:before {
      transform: scale(4) translate(37%);
    } 
  }
}


@each $bname, $bcolors in $btns {
  .btn--#{$bname} {
    background-color: map-get($bcolors, gstart);
    color: map-get($bcolors, tstart);
  
    &:before {
      background-color: map-get($bcolors, gend);
      background-image: linear-gradient(to right, map-get($bcolors, gend) 30%, map-get($bcolors, gstart) 100%);
      position: absolute;
    }
    
    &:hover,
    &:focus,
    &:active {    
      color: map-get($bcolors, tend);
    }
  }
}

.cont {
  background:#fff;
  padding:100px;
  padding-top:0;
  border-radius:10px;
}

.question {
  font-family: 'Source Sans Pro', sans-serif;
  text-align: center;
  top:150px;
  color: #000;
  padding:50px;
}

.quizButtons{
  width:100%;
  height:100%;
  padding: 3vh 5vw;
  font-size: 250%;
  background: -webkit-linear-gradient(#4b6cb7 0%, #182848 100%);
}

.timer {
  background-color: #fff;
  border-radius:10px;
  padding:10px;
  font-size:220%;
  min-width: 10vh;
}

@media (max-width: 768px) {

}

</style>
