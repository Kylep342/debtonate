<script setup>
import { computed } from 'vue';

import BudgetCard from './BudgetCard.vue';
import ManagementPanel from './ManagementPanel.vue';
import constants from '../constants/constants';

const props = defineProps(['createFunction', 'budgets', 'budgetsTotals']);
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
  <base-card :class="['bg-base-100']" :id="'budgetManagementPanel'">
    <template #cardTitle>
      <ManagementPanel
        :createFunction='createFunction'
        :title='title'
      />
    </template>
    <template #cardContent>
      <div :class="['panel']" v-show='props.budgets.length'>
        <ul v-if="budgets.length">
          <li v-for='(budget, index) in orderedBudgets' :key='budget.id' :class="['card']">
            <BudgetCard
              :budget='budget'
              :budgetTotals='props.budgetsTotals[budget.id]'
              :index='index'
            />
          </li>
        </ul>
      </div>
    </template>
  </base-card>
</template>
