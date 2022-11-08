<script>
import BudgetCard from './BudgetCard.vue';

export default {
    props: ["budgets", "deleteBudget"],
    components: { BudgetCard }
}
</script>

<template>
  <div id="budgetsPanel" v-show="this.budgets.length">
    <ul class="cardHolder">
      <li v-for="(budget, index) in this.budgets" :key="budget.id" class="card">
        <BudgetCard :budget="budget" :index="index + 1" :deleteBudget="this.deleteBudget" />
      </li>
    </ul>
  </div>
</template>
