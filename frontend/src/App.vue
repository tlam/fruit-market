<template>
  <div id="app">
    <start-game></start-game>
    <hello></hello>
  </div>
</template>

<script>

import Hello from './components/Hello.vue'
import StartGame from './components/StartGame.vue'

export default {
  name: 'app',
  components: {
    Hello,
    StartGame
  }
}
</script>
