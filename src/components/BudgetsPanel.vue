<script>
import BudgetCard from './BudgetCard.vue';
import constants from '../constants/constants';

export default {
  props: [
    'budgets',
    'budgetsTotals',
    'deleteBudget',
    'editBudget',
    'viewBudget',
  ],
  components: { BudgetCard },
  computed: {
    defaultBudgetIndex() {
      return this.budgets.findIndex((budget) => budget.id === constants.DEFAULT);
    },
    orderedBudgets() {
      return [
        this.budgets[this.defaultBudgetIndex],
        ...this.budgets.slice(0, this.defaultBudgetIndex),
        ...this.budgets.slice(this.defaultBudgetIndex + 1),
      ];
    },
  },
};
</script>

<template>
  <div :class="['panel']" v-show='this.budgets.length'>
    <ul :class="['cardHolder']">
      <li v-for='(budget, index) in this.orderedBudgets' :key='budget.id' :class="['card']">
        <BudgetCard
          :budget='budget'
          :budgetTotals='this.budgetsTotals[budget.id]'
          :deleteBudget='this.deleteBudget'
          :editBudget='this.editBudget'
          :index='index'
          :viewBudget='this.viewBudget'
        />
      </li>
    </ul>
  </div>
</template>
