<script setup>
import {
  computed,
  inject,
  ref,
  onBeforeUnmount,
  onMounted,
} from 'vue';

import BudgetCard from './BudgetCard.vue';
import ManagementPanel from './ManagementPanel.vue';
import constants from '../constants/constants';
import { heightRestOfViewport } from '../functions/viewport';

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

const scrollContainer = ref(null);

onMounted(() => {
  scrollContainer.value.style.maxHeight = `${heightRestOfViewport(scrollContainer)}px`;
  window.addEventListener('resizeBudgetsPanel', heightRestOfViewport);
});

onBeforeUnmount(() => {
  window.removeEventListener('resizeBudgetsPanel', heightRestOfViewport);
});
</script>

<template>
  <base-card :class="['bg-base-100', 'w-90']" :id="'budgetManagementPanel'">
    <template #cardTitle>
      <ManagementPanel :createFunction="createFunction" :title="constants.BUDGETS"
        :class="['sticky', 'fixed', 'border-b-2']" />
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
          <li v-for="(budget) in orderedBudgets" :key="budget.id" :class="['']">
            <BudgetCard :budget="budget" :budgetTotals="props.budgetsTotals[budget.id]" />
          </li>
        </ul>
      </div>
    </template>
  </base-card>
</template>
