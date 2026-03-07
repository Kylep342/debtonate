<script setup lang="ts">
import constants from '@/apps/appreciate/constants/constants';
import { useAppreciateCoreStore, AppreciateCoreStore } from '@/apps/appreciate/stores/core';
import GraphsFrame from '@/apps/shared/components/GraphsFrame.vue';

defineProps<{
  extraViewIds?: string[];
}>();

const state: AppreciateCoreStore = useAppreciateCoreStore();
</script>

<template>
  <GraphsFrame
    :key="state.viewPhase"
    :graphs="state.graphs"
    :extra-view-ids="extraViewIds"
    :pivot-items="state.instrumentsWithTotals"
    :watched-items="state.instruments"
    :get-item-name="state.getInstrumentName"
    :initial-item-id="constants.TOTALS"
    :initial-graph-id="constants.GRAPH_BALANCES_OVER_TIME"
  >
    <template v-for="id in extraViewIds" :key="id" #[`view-${id}`]="slotProps">
      <slot :name="`view-${id}`" v-bind="slotProps" />
    </template>
  </GraphsFrame>
</template>
