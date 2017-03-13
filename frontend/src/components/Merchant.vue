<template>
<div v-if="merchant !== null">
  <img :src="'/static/images/merchants/' + merchant.image" />
  <div>
    VP: {{merchant.vp}}
    <div v-if="merchant.kiwi > 0" class="kiwi-cost">{{merchant.kiwi}}</div>
    <div v-if="merchant.dragonFruit > 0" class="dragon-fruit-cost">{{merchant.dragonFruit}}</div>
    <div v-if="merchant.plum > 0" class="plum-cost">{{merchant.plum}}</div>
    <div v-if="merchant.olive > 0" class="olive-cost">{{merchant.olive}}</div>
    <div v-if="merchant.strawberry > 0" class="strawberry-cost">{{merchant.strawberry}}</div>
  </div>
</div>
</template>

<script>
export default {
  name: 'merchant',
  data () {
    return {
    }
  },
  props: ['merchant']
}
</script>
