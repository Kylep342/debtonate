<script setup lang="ts">
import { computed, reactive, watch, ComputedRef, Reactive } from 'vue';

import InstrumentCard from '@/apps/appreciate/components/InstrumentCard.vue';
import constants from '@/apps/appreciate/constants/constants';
import { useAppreciateCoreStore, AppreciateCoreStore } from '@/apps/appreciate/stores/core';
import ListPanel from '@/apps/shared/components/ListPanel.vue';
import { usePivot } from '@/apps/shared/composables/usePivot';
import { Button, Menu } from '@/apps/shared/types/app';
import { MonthlyBudget } from '@/apps/shared/types/core';

const state: AppreciateCoreStore = useAppreciateCoreStore();

const {
  viewedItemId: viewedBudgetId,
  setViewedItemId: setViewedBudgetId
} = usePivot(constants.DEFAULT);

watch(() => state.viewPhase, () => {
  setViewedBudgetId(constants.DEFAULT);
});

const budgetSelectors: ComputedRef<Button[]> = computed(() => {
  const budgets = state.viewPhase === constants.PHASE_CAREER
    ? state.monthlyBudgets
    : state.monthlyWithdrawalBudgets;

  return budgets.map((budget: MonthlyBudget) => ({
    text: state.viewPhase === constants.PHASE_CAREER
      ? state.getBudgetName(budget.id)
      : state.getWithdrawalBudgetName(budget.id),
    onClick: () => setViewedBudgetId(budget.id),
  }));
});

const pivotMenu: Reactive<Menu> = reactive({
  text: constants.BTN_PIVOT,
  buttons: budgetSelectors,
  classes: ['btn-sm']
});
</script>

<template>
  <ListPanel
    panel-id="instrumentManagementPanel"
    :title="constants.INSTRUMENTS"
    :items="state.instrumentsWithTotals"
    :create-item="state.openInstrumentForm"
    :pivot-menu="pivotMenu"
    :create-text="constants.BTN_CREATE"
  >
    <template #item="{ item }">
      <InstrumentCard
        :instrument="item"
        :viewed-budget-id="viewedBudgetId"
      />
    </template>
  </ListPanel>
</template>
