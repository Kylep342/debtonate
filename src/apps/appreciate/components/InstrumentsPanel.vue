<script setup lang="ts">
import { computed, reactive, ComputedRef, Reactive } from 'vue';

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

const budgetSelectors: ComputedRef<Button[]> = computed(
  () => (state.monthlyBudgets.map((budget: MonthlyBudget) => ({
    text: state.getBudgetName(budget.id),
    onClick: () => setViewedBudgetId(budget.id),
  })))
);

const pivotMenu: Reactive<Menu> = reactive({
  text: constants.BTN_PIVOT,
  buttons: budgetSelectors,
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
