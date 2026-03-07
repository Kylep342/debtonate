<script setup lang="ts">
import moneyfunx from 'moneyfunx';
import { computed, reactive, ComputedRef, Reactive } from 'vue';

import BudgetCard from '@/apps/appreciate/components/BudgetCard.vue';
import constants from '@/apps/appreciate/constants/constants';
import { useAppreciateCoreStore, AppreciateCoreStore } from '@/apps/appreciate/stores/core';
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
  classes: ['btn-sm']
});

const isCareerPhase = computed(() => state.viewPhase === constants.PHASE_CAREER);

const displayedBudgets = computed(() => isCareerPhase.value ? state.monthlyBudgets : state.monthlyWithdrawalBudgets);

const defaultBudgetIndex: ComputedRef<number> = computed(
  () => displayedBudgets.value.findIndex((budget: MonthlyBudget) => budget.id === constants.DEFAULT)
);

const orderedBudgets: ComputedRef<MonthlyBudget[]> = computed(() => [
  displayedBudgets.value[defaultBudgetIndex.value],
  ...displayedBudgets.value.slice(0, defaultBudgetIndex.value),
  ...displayedBudgets.value.slice(defaultBudgetIndex.value + 1),
]);

const panelTitle = computed(() => isCareerPhase.value ? constants.BUDGETS : constants.WITHDRAWALS);
const createBudgetAction = () => isCareerPhase.value ? state.openBudgetForm() : state.openBudgetForm(); // TODO: withdrawal form
</script>

<template>
  <ListPanel
    panel-id="budgetManagementPanel"
    :title="panelTitle"
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
