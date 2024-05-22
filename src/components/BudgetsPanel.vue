<script setup>
import { computed, inject, ref } from 'vue';

import BudgetCard from './BudgetCard.vue';
import ManagementPanel from './ManagementPanel.vue';
import constants from '../constants/constants';

const props = defineProps(['budgetsTotals', 'createFunction']);

const budgetPrimitives = inject('budgetPrimitives');
const budgets = ref(budgetPrimitives.monthlyBudgets);
const title = 'Budgets';

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
  <base-card
    :class="['bg-base-100', 'h-screen', 'w-90']"
    :id="'budgetManagementPanel'"
  >
    <template #cardTitle>
      <ManagementPanel :createFunction="createFunction" :title="title" />
    </template>
    <template #cardBody>
      <!-- props.budgers always has min budget, so don't show it until another is created-->
      <div :class="['overscroll-y-auto']" v-show="budgets.length">
        <div
          v-for="(budget, index) in orderedBudgets"
          :key="budget.id"
          :class="['card']"
        >
          <BudgetCard
            :budget="budget"
            :budgetTotals="props.budgetsTotals[budget.id]"
            :index="index"
          />
        </div>
      </div>
    </template>
  </base-card>
</template>
