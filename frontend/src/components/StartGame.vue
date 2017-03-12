<template>
  <div>
    <b>Fruit Market</b>
    <select id="players">
      <option val="2">2</option>
      <option val="3">3</option>
    </select>
    <button v-on:click="start">Start</button>
    <button v-on:click="resume">Resume</button>

    <div class="alert alert-info" role="alert">
      <div>{{msg}}</div>
    </div>

    <div v-if="board.lineThree" class="row development">
      <div class="col-md-2"> III ({{board.deckThree.length}})</div>
      <div v-for="card in board.lineThree" class="col-md-2">
        <card area="development" :card="card"></card>
      </div>
    </div>
    <div v-if="board.deckTwo" class="row development">
      <div class="col-md-2"> II ({{board.deckTwo.length}})</div>
      <div v-for="card in board.lineTwo" class="col-md-2">
        <card area="development" :card="card"></card>
      </div>
    </div>
    <div v-if="board.deckOne" class="row development">
      <div class="col-md-2"> I ({{board.deckOne.length}})</div>
      <div v-for="card in board.lineOne" class="col-md-2">
        <card area="development" :card="card"></card>
      </div>
    </div>
  </div>
</template>

<script>
import Card from './Card.vue'

export default {
  name: 'start-game',
  components: {
    Card
  },
  data () {
    return {
      board: {},
      cost: {},
      currentPlayer: {},
      fruits:['dragonFruit', 'kiwi', 'olive', 'strawberry', 'plum'],
      msg: 'Start game',
      paid: {
        dragonFruit: 0,
        kiwi: 0,
        olive: 0,
        strawberry: 0,
        plum: 0
      },
      playerDevelopment: {
        dragonFruit: 0,
        kiwi: 0,
        olive: 0,
        strawberry: 0,
        plum: 0
      },
      selectedCard: null,
      show: false,
      taken: {
        dragonFruit: 0,
        kiwi: 0,
        olive: 0,
        strawberry: 0,
        plum: 0
      },
      tokenSpent: {
        dragonFruit: 0,
        kiwi: 0,
        olive: 0,
        strawberry: 0,
        plum: 0,
        pineapple: 0
      }
    }
  },
  methods: {
    start: function(event) {
      this.$socket.emit('start game', {
        numPlayers: 2
      });
    },
    reset: function() {
      for (var fruit in this.paid) {
        this.paid[fruit] = 0;
      }
      for (var fruit in this.taken) {
        this.taken[fruit] = 0;
      }
      for (var fruit in this.tokenSpent) {
        this.tokenSpent[fruit] = 0;
      }
      this.selectedCard = null;
    },
    resume: function(event) {
      this.$socket.emit('resume', {});
    }
  },
  sockets: {
    'display cards': function(data) {
      console.log('display cards');
      this.reset();
      this.board = data.board;
      this.msg = data.msg;
      for (let player of this.board.players) {
        if (player.isTurn) {
          this.currentPlayer = player;
          this.playerDevelopment.dragonFruit = player.dragonFruitDevelopment;
          this.playerDevelopment.kiwi = player.kiwiDevelopment;
          this.playerDevelopment.olive = player.oliveDevelopment;
          this.playerDevelopment.strawberry = player.strawberryDevelopment;
          this.playerDevelopment.plum = player.plumDevelopment;
        }
      }
    },
    'status': function(data) {
      this.msg = data.msg;
    }
  }
}
</script>
