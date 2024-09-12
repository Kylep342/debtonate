<script setup>
import { computed, inject, ref } from 'vue';

import BudgetCard from './BudgetCard.vue';
import ManagementPanel from './ManagementPanel.vue';
import constants from '../constants/constants';

const props = defineProps(['budgetsTotals', 'createFunction']);

const budgetPrimitives = inject('budgetPrimitives');
const budgets = ref(budgetPrimitives.monthlyBudgets);

const defaultBudgetIndex = computed(
  () => budgets.value.findIndex((budget) => budget.id === constants.DEFAULT),
);
const orderedBudgets = computed(() => [
  budgets.value[defaultBudgetIndex.value],
  ...budgets.value.slice(0, defaultBudgetIndex.value),
  ...budgets.value.slice(defaultBudgetIndex.value + 1),
]);
</script>

<template>
  <base-card :class="['bg-base-100', 'w-90']" :id="'budgetManagementPanel'">
    <template #cardTitle>
      <ManagementPanel :createFunction="createFunction" :title="constants.BUDGETS"
        :class="['sticky', 'fixed', 'border-b-2']" />
    </template>
    <template #cardBody>
      <div :class="[
        'border-r-2',
        'max-h-[calc(100vh-160px)]',
        'overflow-y-auto',
        'flex',
        'flex-col',
        'min-h-0'
      ]">
        <ul>
          <li v-for="(budget) in orderedBudgets" :key="budget.id" :class="['']">
            <BudgetCard :budget="budget" :budgetTotals="props.budgetsTotals[budget.id]" />
          </li>
        </ul>
      </div>
    </template>
  </base-card>
</template>
