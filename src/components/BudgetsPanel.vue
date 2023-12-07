<script>
import BudgetCard from './BudgetCard.vue';

export default {
  props: [
    'budgets',
    'budgetsTotals',
    'deleteBudget',
    'editBudget',
    'viewBudget',
  ],
  components: { BudgetCard },
};
</script>

<template>
  <div :class="['panel']" v-show='this.budgets.length'>
    <ul :class="['cardHolder']">
      <li v-for='(budget, index) in this.budgets' :key='budget.id' :class="['card']">
        <BudgetCard
          :budget='budget'
          :budgetTotals='this.budgetsTotals[budget.id]'
          :deleteBudget='this.deleteBudget'
          :editBudget='this.editBudget'
          :index='index + 1'
          :viewBudget='this.viewBudget'
        />
      </li>
    </ul>
  </div>
</template>
