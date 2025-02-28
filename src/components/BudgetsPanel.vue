<script setup lang="ts">
import {
  computed,
  ref,
  onBeforeUnmount,
  onMounted,
} from 'vue';

import BudgetCard from '@/components/BudgetCard.vue';
import ManagementPanel from '@/components/ManagementPanel.vue';
import constants from '@/constants/constants';
import { fillHeight } from '@/functions/viewport';
import useCoreStore from '@/stores/core';
import { Button } from '@/types/app';
import { MonthlyBudget } from '@/types/core';

const coreState = useCoreStore();

const defaultBudgetIndex = computed<number>(
  () => coreState.monthlyBudgets.findIndex((budget) => budget.id === constants.DEFAULT)
);
const orderedBudgets = computed<MonthlyBudget[]>(() => [
  coreState.monthlyBudgets[defaultBudgetIndex.value],
  ...coreState.monthlyBudgets.slice(0, defaultBudgetIndex.value),
  ...coreState.monthlyBudgets.slice(defaultBudgetIndex.value + 1),
]);

const scrollContainer = ref(null);

const buttons: Array<Button> = [
  {
    text: constants.BTN_CREATE,
    onClick: coreState.openBudgetForm,
    classes: ['btn-success', 'text-center'],
  },
]

onMounted(() => {
  scrollContainer.value.style.maxHeight = `${fillHeight(scrollContainer, 26)}px`;
  window.addEventListener('resizeBudgetsPanel', fillHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener('resizeBudgetsPanel', fillHeight);
});
</script>

<template>
  <base-card :id="'budgetManagementPanel'" :class="['bg-base-100', 'w-90', 'flex-none']">
    <template #cardTitle>
      <ManagementPanel :buttons="buttons" :title="constants.BUDGETS" :class="['sticky', 'fixed', 'border-b-2']" />
    </template>
    <template #cardBody>
      <div ref="scrollContainer" :class="[
        'border-r-2',
        'overflow-y-auto',
        'flex',
        'flex-col',
        'min-h-0'
      ]">
        <ul>
          <li v-for="(budget) in orderedBudgets" :key="budget.id">
            <BudgetCard :budget="budget" />
          </li>
        </ul>
      </div>
    </template>
  </base-card>
</template>
