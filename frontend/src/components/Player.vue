<template>
<div>
  <div class="fruits row">
    <div class="fruit">
      <img src="/static/images/fruits/kiwi.png" />
      <div class="total"> {{player.kiwiToken}}</div>
    </div>
    <div class="fruit">
      <img src="/static/images/fruits/dragon_fruit.png" />
      <div class="total"> {{player.dragonFruitToken}}</div>
    </div>
    <div class="fruit">
      <img src="/static/images/fruits/plum.png" />
      <div class="total"> {{player.plumToken}}</div>
    </div>
    <div class="fruit">
      <img src="/static/images/fruits/olive.png" />
      <div class="total"> {{player.oliveToken}}</div>
    </div>
    <div class="fruit">
      <img src="/static/images/fruits/strawberry.png" />
      <div class="total"> {{player.strawberryToken}}</div>
    </div>
    <div class="fruit">
      <img src="/static/images/fruits/pineapple.png" />
      <div class="total"> {{player.pineappleToken}}</div>
    </div>
  </div>
  <div class="tableau row">
    <div class="col-md-2">
      <div v-for="(card, index) in player.kiwiCards" :class="'stack stack-' + index">
        <card area="hand" :card="card"></card>
      </div>
    </div>
    <div class="col-md-2">
      <div v-for="(card, index) in player.dragonFruitCards" :class="'stack stack-' + index">
        <card area="hand" :card="card"></card>
      </div>
    </div>
    <div class="col-md-2">
      <div v-for="(card, index) in player.plumCards" :class="'stack stack-' + index">
        <card area="hand" :card="card"></card>
      </div>
    </div>
    <div class="col-md-2">
      <div v-for="(card, index) in player.oliveCards" :class="'stack stack-' + index">
        <card area="hand" :card="card"></card>
      </div>
    </div>
    <div class="col-md-2">
      <div v-for="(card, index) in player.strawberryCards" :class="'stack stack-' + index">
        <card area="hand" :card="card"></card>
      </div>
    </div>
  </div>
  <div class="row">
    <h4>Reserved</h4>
    <div v-for="card in player.reserved">
      <card area="development" :card="card" :selectedCard="selectedCard" v-on:selected="selectCard(card)"></card>
    </div>
  </div>
  <div class="row">
    <h4>Merchants</h4>
    <div v-for="merchant in player.merchants" class="merchants">
      <img :src="'/static/images/merchants/' + merchant.image" />
    </div>
  </div>
</div>
</template>

<script>
import Card from './Card.vue'

export default {
  name: 'player',
  components: {
    Card
  },
  data () {
    return {
    }
  },
  props: ['player', 'selectedCard'],
  methods: {
    selectCard: function(card) {
      this.$emit('selected', card);
    }
  }
}
</script>
