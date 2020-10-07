<template>
  <b-container fluid>
     <b-row class="h-100 align-items-center">
        <b-col cols="10" class="mx-auto text-center p4 cont">
          <b-row class="text-center">
            <h2 class="question w-100">{{q.text}}</h2>
          </b-row>
          <b-row style="margin-bottom:10px">
            <b-col style="margin-right:10px;"><b-button class="fancy-btn btn--alpha"><span>{{answer.A}}</span></b-button></b-col>
            <b-col><b-button class="fancy-btn btn--beta"><span>{{answer.B}}</span></b-button></b-col>
          </b-row>
          <b-row>
            <b-col style="margin-right:10px;"><b-button class="fancy-btn btn--gamma"><span>{{answer.C}}</span></b-button></b-col>
            <b-col><b-button class="fancy-btn btn--delta"><span>{{answer.D}}</span></b-button></b-col>
          </b-row>
      </b-col>      
    </b-row>
  </b-container>
</template>

<script>

export default {
  name: 'Quiz',
  data() {

    var choices = ["Choice1", "Choice2", "Choice3", "Choice4"];

    return {
      q: {text: ' The name of an evergreen tree or bush that grows in Australia?'},
      answer: {A: choices[0], B: choices[1], C: choices[2], D: choices[3]}
    }
  }
}
</script>

<style lang="scss" scoped>
//lol
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
  border-radius:20px;
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

@media (max-width: 768px) {

}

</style>
