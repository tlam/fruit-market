<template>
<div v-if="card" class="card" v-bind:class="classObject" v-on:click="selected">
  <div class="top">
    <div class="vp">{{card.vp}}</div>
    <div class="give">
      <span v-if="card.kiwi > 0"><img src="/static/images/fruits/kiwi.png" /></span>
      <span v-if="card.dragonFruit > 0"><img src="/static/images/fruits/dragon_fruit.png" /></span>
      <span v-if="card.plum > 0"><img src="/static/images/fruits/plum.png" /></span>
      <span v-if="card.olive > 0"><img src="/static/images/fruits/olive.png" /></span>
      <span v-if="card.strawberry > 0"><img src="/static/images/fruits/strawberry.png" /></span>
    </div>
  </div>
  <div v-if="card.kiwiCost > 0" class="kiwi-cost">{{card.kiwiCost}}</div>
  <div v-if="card.dragonFruitCost > 0" class="dragon-fruit-cost">{{card.dragonFruitCost}}</div>
  <div v-if="card.plumCost > 0" class="plum-cost">{{card.plumCost}}</div>
  <div v-if="card.oliveCost > 0" class="olive-cost">{{card.oliveCost}}</div>
  <div v-if="card.strawberryCost > 0" class="strawberry-cost">{{card.strawberryCost}}</div>
</div>
</template>

<script>
export default {
  name: 'card',
  data () {
    return {
      active: false
    }
  },
  props: ['area', 'card', 'selectedCard'],
  computed: {
    classObject: function() {
      var cardSelected = false;
      var selectedCard = this.$store.state.selectedCard;
      if (this.area === 'development' && selectedCard && this.card) {
        cardSelected = this.card._id === selectedCard._id;
      }
      return {
        'card-selected': cardSelected
      }
    }
  },
  methods: {
    selected: function() {
      this.$store.commit('setSelectedCard', {
        card: this.card
      });
      this.$emit('selected');
    }
  }
}
</script>
