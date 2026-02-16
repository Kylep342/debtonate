<script setup lang="ts">
import { computed } from 'vue';
import constants from '@/apps/debtonate/constants/constants';
import { useDebtonateCoreStore, DebtonateCoreStore } from '@/apps/debtonate/stores/core';
import GraphsFrame from '@/apps/shared/components/GraphsFrame.vue';

const state: DebtonateCoreStore = useDebtonateCoreStore();

const isRepatriate = computed(() => state.viewPhase === constants.PHASE_REPATRIATE);

const pivotItems = computed(() => {
  if (isRepatriate.value) {
    const parentId = state.selectedLoanId || constants.TOTALS;
    const parentLoan = state.getLoan(parentId);
    if (!parentLoan) return [];
    return [parentLoan, ...(state.refinancingScenarios[parentId] || [])];
  }
  return state.loansWithTotals;
});

const watchedItems = computed(() => {
  if (isRepatriate.value) {
    const parentId = state.selectedLoanId || constants.TOTALS;
    return state.refinancingScenarios[parentId] || [];
  }
  return state.loans;
});

const getScenarioNameLocal = (id: string) => {
  if (!isRepatriate.value) return state.getLoanName(id);

  const parentId = state.selectedLoanId || constants.TOTALS;
  if (id === parentId) return 'Original';
  const scenario = state.refinancingScenarios[parentId]?.find(s => s.id === id);
  return scenario ? scenario.name : id;
};

const initialItemId = computed(() => {
  if (isRepatriate.value) {
    return state.selectedLoanId || constants.TOTALS;
  }
  return constants.TOTALS;
});

</script>

<template>
  <GraphsFrame
    :key="state.viewPhase"
    :graphs="state.graphs"
    :pivot-items="pivotItems"
    :watched-items="watchedItems"
    :get-item-name="getScenarioNameLocal"
    :initial-item-id="initialItemId"
    :initial-graph-id="constants.GRAPH_BALANCES_OVER_TIME"
  />
</template>
