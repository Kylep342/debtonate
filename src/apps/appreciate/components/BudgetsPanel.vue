<script setup lang="ts">
import { computed, reactive } from 'vue';

import BudgetCard from '@/apps/appreciate/components/BudgetCard.vue';
import useAppreciateCoreStore from '@/apps/appreciate/stores/core';
import ListPanel from '@/apps/shared/components/ListPanel.vue';
import { usePivot } from '@/apps/shared/composables/usePivot';
import constants from '@/apps/shared/constants/constants';
import { Button, Menu } from '@/apps/shared/types/app';
import { MonthlyBudget } from '@/apps/shared/types/core';

const state = useAppreciateCoreStore();

const {
  viewedItemId: viewedInstrumentId,
  setViewedItemId: setViewedInstrumentId
} = usePivot(constants.TOTALS);

const instrumentSelectors = computed<Array<Button>>(
  () => (state.instrumentsWithTotals.map((instrument) => ({
    text: state.getInstrumentName(instrument.id),
    onClick: () => setViewedInstrumentId(instrument.id),
  })))
);

const pivotMenu = reactive<Menu>({
  text: constants.BTN_PIVOT,
  buttons: instrumentSelectors,
});

const defaultBudgetIndex = computed<number>(
  () => state.monthlyBudgets.findIndex((budget) => budget.id === constants.DEFAULT)
);

const orderedBudgets = computed<Array<MonthlyBudget>>(() => [
  state.monthlyBudgets[defaultBudgetIndex.value],
  ...state.monthlyBudgets.slice(0, defaultBudgetIndex.value),
  ...state.monthlyBudgets.slice(defaultBudgetIndex.value + 1),
]);
</script>

<template>
  <ListPanel
    panel-id="budgetManagementPanel"
    :title="constants.BUDGETS"
    :items="orderedBudgets"
    :create-item="state.openBudgetForm"
    :pivot-menu="pivotMenu"
    :create-text="constants.BTN_CREATE"
  >
    <template #item="{ item }">
      <BudgetCard
        :budget="item"
        :viewed-instrument-id="viewedInstrumentId"
      />
    </template>
  </ListPanel>
</template>
