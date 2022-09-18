<script>
export default {
   props: ["budgets", "deleteBudget"],
}
</script>

<template>
  <div id="budgetsPanel" v-show="this.budgets.length">
    <ul class="cardHolder">
      <li v-for="budget in this.budgets" :key="budget.id" class="card">
        {{ budget }}
        <br />
        <button @click="this.deleteBudget(budget)">X</button>
      </li>
    </ul>
  </div>
</template>
