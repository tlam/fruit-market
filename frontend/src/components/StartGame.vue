<template>
  <div>
    <b>Fruit Market</b>
    <select id="players">
      <option val="2">2</option>
      <option val="3">3</option>
    </select>
    <button v-on:click="start">Start</button>
    <button v-on:click="resume">Resume</button>
  </div>
</template>

<script>
export default {
  name: 'start-game',
  data () {
    return {
      msg: 'Start game'
    }
  },
  methods: {
    start: function(event) {
      this.$socket.emit('start game', {
        numPlayers: 2
      });
    },
    resume: function(event) {
      this.$socket.emit('resume', {});
    }
  }
}
</script>
