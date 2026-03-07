<script setup lang="ts">
import { computed } from 'vue';
import constants from '@/apps/debtonate/constants/constants';
import { useDebtonateCoreStore, DebtonateCoreStore } from '@/apps/debtonate/stores/core';
import GraphsFrame from '@/apps/shared/components/GraphsFrame.vue';

defineProps<{
  extraViewIds?: string[];
}>();

const state: DebtonateCoreStore = useDebtonateCoreStore();

const pivotItems = computed(() => state.loansWithTotals);

const watchedItems = computed(() => state.loans);

const getScenarioNameLocal = (id: string) => state.getLoanName(id);

const initialItemId = computed(() => state.selectedLoanId || constants.TOTALS);

</script>

<template>
  <GraphsFrame
    :key="state.viewPhase"
    :graphs="state.graphs"
    :extra-view-ids="extraViewIds"
    :pivot-items="pivotItems"
    :watched-items="watchedItems"
    :get-item-name="getScenarioNameLocal"
    :initial-item-id="initialItemId"
    :initial-graph-id="constants.GRAPH_BALANCES_OVER_TIME"
    @update:viewed-item-id="state.setSelectedLoanId"
  >
    <template v-for="id in extraViewIds" :key="id" #[`view-${id}`]="slotProps">
      <slot :name="`view-${id}`" v-bind="slotProps" />
    </template>
  </GraphsFrame>
</template>
