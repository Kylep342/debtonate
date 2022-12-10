<script>
export default {
  props: ['budget', 'index', 'deleteBudget'],
  //
  // NOTE: Sample of more detailed props declaration
  //
  // props: {
  //   budget: Number,
  //   index: {
  //     type: Number,
  //     required: true,
  //     validator: (value) => value > 0,
  //   },
  //   deleteBudget: Function,
  // },
};
</script>

<template>
  <div>
    <div :class="['cardHeader', 'header']">
      <h2 class="cardHeaderTitle">
        +${{ budget }}/month
      </h2>
      <div class="cardHeaderButtonContainer">
        <button :class="['exitButton', 'bold']" @click="this.deleteBudget(this.budget)">x</button>
      </div>
    </div>
  </div>
</template>
