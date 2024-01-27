<script setup>
import { computed } from 'vue';

import BudgetCard from './BudgetCard.vue';
import constants from '../constants/constants';

const props = defineProps(['budgets', 'budgetsTotals', 'deleteBudget', 'editBudget', 'viewBudget']);

const defaultBudgetIndex = computed(() => (
  props.budgets.findIndex((budget) => budget.id === constants.DEFAULT)
));
const orderedBudgets = computed(() => [
  props.budgets[defaultBudgetIndex.value],
  ...props.budgets.slice(0, defaultBudgetIndex.value),
  ...props.budgets.slice(defaultBudgetIndex.value + 1),
]);
</script>

<template>
  <div :class="['panel']" v-show='props.budgets.length'>
    <ul :class="['cardHolder']">
      <li v-for='(budget, index) in orderedBudgets' :key='budget.id' :class="['card']">
        <BudgetCard
          :budget='budget'
          :budgetTotals='props.budgetsTotals[budget.id]'
          :deleteBudget='props.deleteBudget'
          :editBudget='props.editBudget'
          :index='index'
          :viewBudget='props.viewBudget'
        />
      </li>
    </ul>
  </div>
</template>
