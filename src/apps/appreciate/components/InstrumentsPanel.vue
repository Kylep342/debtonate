<script setup lang="ts">
import { computed, reactive } from 'vue';

import { Button, Menu } from '@/apps/shared/types/app';
import { usePivot } from '@/apps/shared/composables/usePivot';
import constants from '@/apps/appreciate/constants/constants';
import InstrumentCard from '@/apps/appreciate/components/InstrumentCard.vue';
import useAppreciateCoreStore from '@/apps/appreciate/stores/core';
import ListPanel from '@/apps/shared/components/ListPanel.vue';

const state = useAppreciateCoreStore();

const {
  viewedItemId: viewedBudgetId,
  setViewedItemId: setViewedBudgetId
} = usePivot(constants.DEFAULT);

const budgetSelectors = computed<Button[]>(
  () => (state.monthlyBudgets.map((budget) => ({
    text: state.getBudgetName(budget.id),
    onClick: () => setViewedBudgetId(budget.id),
  })))
);

const pivotMenu = reactive<Menu>({
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
