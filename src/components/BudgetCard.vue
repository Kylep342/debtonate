<script>
export default {
  props: ["budget", "index", "deleteBudget"]
  }
</script>

<template>
  <div :class="['cardHeader', 'header']">
    <p class="cardHeaderTitle">
      Monthly Budget {{ this.index }}
    </p>
    <div class="cardHeaderButtonContainer">
      <button :class="['exitButton', 'bold']" @click="this.deleteBudget(this.budget)">x</button>
    </div>
  </div>
  <div class="cardBody">
    <h2>${{ budget }}/month</h2>
  </div>
</template>
