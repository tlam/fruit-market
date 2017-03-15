<template>
  <div>
    <b>Fruit Market</b>
    <select id="players">
      <option val="2">2</option>
      <option val="3">3</option>
    </select>
    <button v-on:click="start">Start</button>
    <button v-on:click="resume">Resume</button>

    <div v-if="msg" class="alert alert-info" role="alert">
      <div>{{msg}}</div>
    </div>

    <div class="row">
      <div class="col-md-2">
        <div v-for="player in board.players" v-bind:class="{ 'current-turn': player.isTurn }">
          <h3>Player {{player.number}}, VP: {{player.vp}}</h3>
          <div class="fruit-summary">
            <div class="kiwi-cost card-fruit">{{player.kiwiDevelopment}}</div>
            <div class="dragon-fruit-cost card-fruit">{{player.dragonFruitDevelopment}}</div>
            <div class="plum-cost card-fruit">{{player.plumDevelopment}}</div>
            <div class="olive-cost card-fruit">{{player.oliveDevelopment}}</div>
            <div class="strawberry-cost card-fruit">{{player.strawberryDevelopment}}</div>
          </div>
          <div class="fruit-summary">
            <div class="kiwi-cost">{{player.kiwiToken}}</div>
            <div class="dragon-fruit-cost">{{player.dragonFruitToken}}</div>
            <div class="plum-cost">{{player.plumToken}}</div>
            <div class="olive-cost">{{player.oliveToken}}</div>
            <div class="strawberry-cost">{{player.strawberryToken}}</div>
            <div class="pineapple">{{player.pineapple}}</div>
          </div>
        </div>
      </div>
      <div v-for="merchant in board.merchants" class="col-md-2 merchants">
        <merchant :merchant="merchant"></merchant>
      </div>
      <div class="col-md-4">
        <div class="row purchase">
          <div class="fruit">
            <div><img src="/static/images/fruits/kiwi.png" /></div>
            <div class="total">{{board.kiwi}}</div>
            <div class="take">
              <button class="btn btn-default btn-sm" v-on:click="takeFruit('kiwi')">Take ({{taken.kiwi}})</button>
            </div>
          </div>
          <div class="fruit">
            <div><img src="/static/images/fruits/dragon_fruit.png" /></div>
            <div class="total">{{board.dragonFruit}}</div>
            <div class="take">
              <button class="btn btn-default btn-sm" v-on:click="takeFruit('dragonFruit')">Take ({{taken.dragonFruit}})</button>
            </div>
          </div>
          <div class="fruit">
            <div><img src="/static/images/fruits/plum.png" /></div>
            <div class="total">{{board.plum}}</div>
            <div class="take">
              <button class="btn btn-default btn-sm" v-on:click="takeFruit('plum')">Take ({{taken.plum}})</button>
            </div>
          </div>
          <div class="fruit">
            <div><img src="/static/images/fruits/olive.png" /></div>
            <div class="total">{{board.olive}}</div>
            <div class="take">
              <button class="btn btn-default btn-sm" v-on:click="takeFruit('olive')">Take ({{taken.olive}})</button>
            </div>
          </div>
          <div class="fruit">
            <div><img src="/static/images/fruits/strawberry.png" /></div>
            <div class="total">{{board.strawberry}}</div>
            <div class="take">
              <button class="btn btn-default btn-sm" v-on:click="takeFruit('strawberry')">Take ({{taken.strawberry}})</button>
            </div>
          </div>
          <div class="fruit">
            <div><img src="/static/images/fruits/pineapple.png" /></div>
            <div class="total">{{board.pineapple}}</div>
          </div>
        </div>
        <div class="row">
          <div v-if="show">
            <div class="fruit-summary">
              <div class="summary-label">Cost</div>
              <div class="kiwi-cost">{{selectedCard.kiwiCost}}</div>
              <div class="dragon-fruit-cost">{{selectedCard.dragonFruitCost}}</div>
              <div class="plum-cost">{{selectedCard.plumCost}}</div>
              <div class="olive-cost">{{selectedCard.oliveCost}}</div>
              <div class="strawberry-cost">{{selectedCard.strawberryCost}}</div>
            </div>
            <div class="fruit-summary">
              <div class="summary-label">Dev</div>
              <div class="kiwi-cost card-fruit">{{currentPlayer.kiwiDevelopment}}</div>
              <div class="dragon-fruit-cost card-fruit">{{currentPlayer.dragonFruitDevelopment}}</div>
              <div class="plum-cost card-fruit">{{currentPlayer.plumDevelopment}}</div>
              <div class="olive-cost card-fruit">{{currentPlayer.oliveDevelopment}}</div>
              <div class="strawberry-cost card-fruit">{{currentPlayer.strawberryDevelopment}}</div>
            </div>
            <div class="fruit-summary">
              <div class="summary-label">Paid</div>
              <div class="kiwi-cost">{{paid.kiwi}}</div>
              <div class="dragon-fruit-cost">{{paid.dragonFruit}}</div>
              <div class="plum-cost">{{paid.plum}}</div>
              <div class="olive-cost">{{paid.olive}}</div>
              <div class="strawberry-cost">{{paid.strawberry}}</div>
            </div>
            <div class="fruit-summary player-tokens">
              <div class="summary-label">Tokens</div>
              <div class="kiwi-cost tokens" v-on:click="selectToken('kiwi')">{{currentPlayer.kiwiToken}}</div>
              <div class="dragon-fruit-cost tokens" v-on:click="selectToken('dragonFruit')">{{currentPlayer.dragonFruitToken}}</div>
              <div class="plum-cost tokens" v-on:click="selectToken('plum')">{{currentPlayer.plumToken}}</div>
              <div class="olive-cost tokens" v-on:click="selectToken('olive')">{{currentPlayer.oliveToken}}</div>
              <div class="strawberry-cost tokens" v-on:click="selectToken('strawberry')">{{currentPlayer.strawberryToken}}</div>
              <div class="pineapple tokens" v-on:click="selectToken('pineapple')">{{currentPlayer.pineapple}}</div>
            </div>
          </div>
        </div>
        <div>
          <button class="btn btn-default btn-sm" v-on:click="buy()">Buy</button>
          <button class="btn btn-default btn-sm" v-on:click="reserve()">Reserve</button>
          <button class="btn btn-default btn-sm" v-on:click="reset()">Reset</button>
          <button class="btn btn-default btn-sm" v-on:click="endTurn()">End Turn</button>
        </div>
      </div>
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

    <div v-for="player in board.players">
      <h3> Player {{player.number}}, VP: {{player.vp}}, Turn: {{player.isTurn}}</h3>
      <player :player="player"></player>
    </div>
    <p>
      <b> * 2 fruits same color:</b>
      <em>This action is only possible if there are at least 4 tokens of the chosen color left when the player takes them.</em>
    </p>
  </div>
</template>

<script>
import Card from './Card.vue'
import Merchant from './Merchant.vue'
import Player from './Player.vue'

export default {
  name: 'start-game',
  components: {
    Card,
    Merchant,
    Player
  },
  data () {
    var fruits = ['dragonFruit', 'kiwi', 'olive', 'strawberry', 'plum'];
    var paid = {};
    var playerDevelopment = {};
    var taken = {};
    var tokenSpent = {
      pineapple: 0
    };
    for (let fruit of fruits) {
      paid[fruit] = 0;
      playerDevelopment[fruit] = 0;
      taken[fruit] = 0;
      tokenSpent[fruit] = 0;
    }

    return {
      board: {},
      cost: {},
      currentPlayer: {},
      fruits: fruits,
      msg: 'Start game',
      paid: paid,
      playerDevelopment: playerDevelopment,
      selectedCard: null,
      show: false,
      taken: taken,
      tokenSpent: tokenSpent
    }
  },
  methods: {
    buy: function() {
      var selectedCard = this.$store.state.selectedCard;
      this.show = selectedCard !== null;
      if (this.currentPlayer.isTurn && selectedCard) {
        this.selectedCard = selectedCard;
        var dragonFruitCost = selectedCard.dragonFruitCost;
        var kiwiCost = selectedCard.kiwiCost;
        var oliveCost = selectedCard.oliveCost;
        var strawberryCost = selectedCard.strawberryCost;
        var plumCost = selectedCard.plumCost;

        var costMet = (dragonFruitCost === 0 || (dragonFruitCost > 0 && dragonFruitCost <= this.paid.dragonFruit + this.playerDevelopment.dragonFruit)) &&
          (kiwiCost === 0 || (kiwiCost > 0 && kiwiCost <= this.paid.kiwi + this.playerDevelopment.kiwi)) &&
          (oliveCost === 0 || (oliveCost > 0 && oliveCost <= this.paid.olive + this.playerDevelopment.olive)) &&
          (strawberryCost === 0 || (strawberryCost > 0 && strawberryCost <= this.paid.strawberry + this.playerDevelopment.strawberry)) &&
          (plumCost === 0 || (plumCost > 0 && plumCost <= this.paid.plum + this.playerDevelopment.plum));
        if (costMet) {
          console.log('Cost met for ' + selectedCard._id);
          this.show = false;
          this.$socket.emit('buy', {
            card: selectedCard._id,
            paid: this.tokenSpent,
            player: this.currentPlayer._id
          });
        }
        else {
          this.msg = 'Cost not met';
        }
      }
    },
    endTurn: function() {
      for (let player of this.board.players) {
        if (player.isTurn) {
          console.log('Ending turn');
          this.$socket.emit('end turn', {
            player: player._id,
            dragonFruit: this.taken.dragonFruit,
            kiwi: this.taken.kiwi,
            olive: this.taken.olive,
            strawberry: this.taken.strawberry,
            plum: this.taken.plum,
            numPlayers: this.board.players.length
          });
        }
      }
    },
    reserve: function() {
      var selectedCard = this.$store.state.selectedCard;
      if (selectedCard !== null) {
        this.$socket.emit('reserve', {
          card: selectedCard._id,
          player: this.currentPlayer._id
        });
      }
    },
    reset: function() {
      for (let fruit of this.fruits) {
        this.paid[fruit] = 0;
        this.taken[fruit] = 0;
        this.tokenSpent[fruit] = 0;
      }
      this.tokenSpent.pineapple = 0;
      this.$store.commit('reset');
    },
    resume: function(event) {
      this.$socket.emit('resume', {});
    },
    selectToken: function(token) {
      var cost = this.$store.state.cost;
      if (this.fruits.indexOf(token) > -1 && cost[token] > 0 && this.paid[token] < this.currentPlayer[token]) {
        this.paid[token] += 1;
        this.tokenSpent[token] += 1;
      }
      else if (token === 'pineapple' && this.tokenSpent[token] < this.currentPlayer.pineapple) {
        for (let fruit in cost) {
          console.log('looping ' + fruit);
          console.log(this.paid[fruit] + this.playerDevelopment[fruit]);
          console.log(this.currentPlayer[fruit]);
          if (cost[fruit] > 0 && this.paid[fruit] + this.playerDevelopment[fruit] < cost[fruit]) {
            console.log('selecting pineapple');
            this.paid[fruit] += 1;
            this.tokenSpent[token] += 1;
            break;
          }
        }
      }
    },
    start: function(event) {
      this.$socket.emit('start game', {
        numPlayers: 2
      });
    },
    takeFruit: function(fruit) {
      if (this.taken[fruit] < this.board[fruit]) {
        this.taken[fruit] += 1;
      }
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
