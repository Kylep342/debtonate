<script setup lang="ts">
import * as moneyfunx from 'moneyfunx';
import { computed, reactive, type ComputedRef, type Reactive } from 'vue';

import BudgetCard from '@/apps/appreciate/components/BudgetCard.vue';
import constants from '@/apps/appreciate/constants/constants';
import { useAppreciateCoreStore, type AppreciateCoreStore } from '@/apps/appreciate/stores/core';
import ListPanel from '@/apps/shared/components/ListPanel.vue';
import { usePivot } from '@/apps/shared/composables/usePivot';
import { Button, Menu } from '@/apps/shared/types/app';
import { MonthlyBudget } from '@/apps/shared/types/core';

const state: AppreciateCoreStore = useAppreciateCoreStore();

const {
  viewedItemId: viewedInstrumentId,
  setViewedItemId: setViewedInstrumentId
} = usePivot(constants.TOTALS);

const instrumentSelectors: ComputedRef<Button[]> = computed(
  () => (state.instrumentsWithTotals.map((instrument: moneyfunx.IInstrument) => ({
    text: state.getInstrumentName(instrument.id),
    onClick: () => setViewedInstrumentId(instrument.id),
  })))
);

const pivotMenu: Reactive<Menu> = reactive({
  text: constants.BTN_PIVOT,
  buttons: instrumentSelectors,
});

const defaultBudgetIndex: ComputedRef<number> = computed(
  () => state.monthlyBudgets.findIndex((budget: MonthlyBudget) => budget.id === constants.DEFAULT)
);

const orderedBudgets: ComputedRef<MonthlyBudget[]> = computed(() => [
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
