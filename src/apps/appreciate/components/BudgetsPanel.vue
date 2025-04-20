<script setup lang="ts">
import { computed, reactive } from 'vue';

import { Button } from '@/apps/shared/types/app';
import { MonthlyBudget } from '@/apps/shared/types/core';
import { usePivot } from '@/apps/shared/composables/usePivot';
import { useResize } from '@/apps/shared/composables/useResize';
import BudgetCard from './BudgetCard.vue';
import constants from '@/apps/shared/constants/constants';
import ManagementPanel from '@/apps/shared/components/ManagementPanel.vue';
import useAppreciateCoreStore from '../stores/core';

const state = useAppreciateCoreStore();

const {
  viewedItemId: viewedInstrumentId,
  isViewedItemId: isViewedInstrumentId,
  setViewedItemId: setViewedInstrumentId
} = usePivot(constants.TOTALS);

const { scrollContainer } = useResize('resizeAppreciateBudgetsPanel');

const instrumentSelectors = computed<Array<Button>>(
  () => (state.instrumentsWithTotals.map((instrument) => ({
    text: state.getInstrumentName(instrument.id),
    onClick: () => setViewedInstrumentId(instrument.id),
  })))
);

const button = <Button>{
  text: constants.BTN_CREATE,
  onClick: state.openBudgetForm,
  classes: ['btn-success', 'text-center'],
};

const menu = reactive<Menu>({
  text: constants.BTN_PIVOT,
  buttons: instrumentSelectors,
});

const defaultBudgetIndex = computed<number>(
  () => state.monthlyBudgets.findIndex((budget) => budget.id === constants.DEFAULT)
);

const orderedBudgets = computed<MonthlyBudget[]>(() => [
  state.monthlyBudgets[defaultBudgetIndex.value],
  ...state.monthlyBudgets.slice(0, defaultBudgetIndex.value),
  ...state.monthlyBudgets.slice(defaultBudgetIndex.value + 1),
]);
</script>

<template>
  <base-card :id="'budgetManagementPanel'" :class="['bg-base-100', 'w-90', 'flex-none']">
    <template #cardTitle>
      <ManagementPanel :button="button" :menu="menu" :title="constants.BUDGETS" :class="['border-b-2']" />
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
            <BudgetCard :budget="budget" :viewedInstrumentId="viewedInstrumentId" />
          </li>
        </ul>
      </div>
    </template>
  </base-card>
</template>
