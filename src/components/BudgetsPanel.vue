<script setup>
import { computed } from 'vue';

import BudgetCard from './BudgetCard.vue';
import ManagementPanel from './ManagementPanel.vue';
import constants from '../constants/constants';

const props = defineProps([
  'budgets',
  'budgetsTotals',
  'createFunction',
]);
const title = 'Budgets';

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
  <base-card
    :class="['bg-base-100', 'h-screen', 'w-90']"
    :id="'budgetManagementPanel'"
  >
    <template #cardTitle>
      <ManagementPanel
        :createFunction='createFunction'
        :title='title'
      />
    </template>
    <template #cardBody>
      <div :class="['overscroll-y-auto']" v-show='props.budgets.length'>
        <div v-for='(budget, index) in orderedBudgets' :key='budget.id' :class="['card']">
          <BudgetCard
            :budget='budget'
            :budgetTotals='props.budgetsTotals[budget.id]'
            :index='index'
          />
        </div>
      </div>
    </template>
  </base-card>
</template>
