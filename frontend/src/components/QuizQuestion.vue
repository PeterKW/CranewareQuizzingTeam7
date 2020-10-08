<template>
  <div class="cont">
    <b-row class="text-center">
      <h2 class="question w-100">{{question}}</h2>
    </b-row>
    <b-row style="margin-bottom:10px">
      <b-col style="margin-right:10px;"><b-button @click="onAnswer('A')" class="fancy-btn btn--alpha"><span>{{a}}</span></b-button></b-col>
      <b-col><b-button @click="onAnswer('B')" class="fancy-btn btn--beta"><span>{{b}}</span></b-button></b-col>
    </b-row>
    <b-row>
      <b-col style="margin-right:10px;"><b-button @click="onAnswer('C')" class="fancy-btn btn--gamma"><span>{{c}}</span></b-button></b-col>
      <b-col><b-button @click="onAnswer('D')" class="fancy-btn btn--delta"><span>{{d}}</span></b-button></b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'QuizQuestion',
  props: [
      "question","a","b","c","d"
  ],
  methods: {
    onAnswer(answer) {
      this.$emit('answer', answer);
    }
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

  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  display: block;
  line-height: 1em; /* a */
  min-height: 3em; /* a x number of line to show (ex : 2 line)  */
  
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
</style>
