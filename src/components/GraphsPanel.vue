<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { usePivot } from '@/composables/usePivot';
import constants from '@/constants/constants';
import useCoreStore from '@/stores/core';
import { Button } from '@/types/app';
import { GraphConfig } from '@/types/graph';

const coreState = useCoreStore();

const { viewedItemId, isViewedItemId, setViewedItemId } = usePivot(constants.TOTALS);

const viewedGraphId = ref<string>(constants.GRAPH_BALANCES_OVER_TIME);
const activeGraph = computed<GraphConfig>(() => coreState.graphs[viewedGraphId.value]);
const setViewedGraphId = (graphId) => viewedGraphId.value = graphId;

const buttons: Array<Button> = Object.keys(coreState.graphs).map((graphId) => ({
  text: graphId,
  onClick: () => setViewedGraphId(graphId),
}));

watch(() => coreState.loans, async (loans) => {
  if (!loans.map((loan) => loan.id).includes(viewedItemId.value)) {
    setViewedItemId(constants.TOTALS);
  }
});
</script>

<template>
  <div>
    <div :class="['card-actions', 'flow-root', 'p-0']">
      <div :class="['flex', 'justify-between', 'pr-4']">
        <h2 :class="['cardHeaderTitle', 'float-left', 'p-4']">
          {{ constants.GRAPHS }} - {{ viewedGraphId }}
        </h2>
        <base-menu :menu="constants.BTN_SELECT" :buttons="buttons" />
      </div>
    </div>
    <div :class="['tabframe', 'w-fit']">
      <base-tabs :get-item-name="coreState.getLoanName" :pivot="coreState.loansWithTotals"
        :is-viewed-item-id="isViewedItemId" :set-viewed-item-id="setViewedItemId">
        <template #tabContent>
          <base-graph :key="viewedItemId" :graph="activeGraph" :anchor-id="viewedItemId" />
        </template>
      </base-tabs>
    </div>
  </div>
</template>
