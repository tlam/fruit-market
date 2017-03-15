import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cost: {},
    selectedCard: null
  },
  mutations: {
    reset(state) {
      state.cost = {};
      state.selectedCard = null;
    },
    setSelectedCard(state, payload) {
      var card = payload.card;
      state.selectedCard = card;
      state.cost.dragonFruit = card.dragonFruitCost;
      state.cost.kiwi = card.kiwiCost;
      state.cost.olive = card.oliveCost;
      state.cost.strawberry = card.strawberryCost;
      state.cost.plum = card.plumCost;
    }
  }
});
