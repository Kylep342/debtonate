<script setup>
import {
  computed,
  ref,
  onBeforeUnmount,
  onMounted,
} from 'vue';

import BudgetCard from './BudgetCard.vue';
import ManagementPanel from './ManagementPanel.vue';
import constants from '../constants/constants';
import useCoreStore from '../stores/core';
import { heightRestOfViewport } from '../functions/viewport';

const state = useCoreStore();

const defaultBudgetIndex = computed(
  () => state.monthlyBudgets.findIndex((budget) => budget.id === constants.DEFAULT),
);
const orderedBudgets = computed(() => [
  state.monthlyBudgets[defaultBudgetIndex.value],
  ...state.monthlyBudgets.slice(0, defaultBudgetIndex.value),
  ...state.monthlyBudgets.slice(defaultBudgetIndex.value + 1),
]);

const scrollContainer = ref(null);

onMounted(() => {
  scrollContainer.value.style.maxHeight = `${heightRestOfViewport(scrollContainer, 26)}px`;
  window.addEventListener('resizeBudgetsPanel', heightRestOfViewport);
});

onBeforeUnmount(() => {
  window.removeEventListener('resizeBudgetsPanel', heightRestOfViewport);
});
</script>

<template>
  <base-card
    :id="'budgetManagementPanel'"
    :class="['bg-base-100', 'w-90']"
  >
    <template #cardTitle>
      <ManagementPanel
        :create-function="state.openCreateBudgetForm"
        :title="constants.BUDGETS"
        :class="['sticky', 'fixed', 'border-b-2']"
      />
    </template>
    <template #cardBody>
      <div
        ref="scrollContainer"
        :class="[
          'border-r-2',
          'overflow-y-auto',
          'flex',
          'flex-col',
          'min-h-0'
        ]"
      >
        <ul>
          <li
            v-for="(budget) in orderedBudgets"
            :key="budget.id"
          >
            <BudgetCard
              :budget="budget"
              :budget-totals="state.totalsByBudget[budget.id]"
            />
          </li>
        </ul>
      </div>
    </template>
  </base-card>
</template>
