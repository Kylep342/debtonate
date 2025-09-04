<script setup lang="ts">
import constants from '@/apps/debtonate/constants/constants';
import useDebtonateCoreStore from '@/apps/debtonate/stores/core';
import GraphsFrame from '@/apps/shared/components/GraphsFrame.vue';

const state = useDebtonateCoreStore();
</script>

<template>
  <GraphsFrame
    :graphs="state.graphs"
    :pivot-items="state.loansWithTotals"
    :watched-items="state.loans"
    :get-item-name="state.getLoanName"
    :constants="constants"
    :initial-graph-id="constants.GRAPH_BALANCES_OVER_TIME"
  />
</template>
