<script>
export default {
  props: ['budget', 'index', 'deleteBudget'],
};
</script>

<template>
  <div>
    <div :class="['cardHeader', 'header']">
      <h2 class="cardHeaderTitle">
        +${{ budget }}/month
      </h2>
      <div class="cardheaderSubSection">
        <button :class="['exitButton', 'bold']" @click="this.deleteBudget(this.budget)">x</button>
      </div>
    </div>
  </div>
</template>
