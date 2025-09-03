<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { Button } from '@/apps/shared/types/app';
import { GraphConfig } from '@/apps/shared/types/graph';
import { usePivot } from '@/apps/shared/composables/usePivot';
import constants from '../constants/constants';
import useAppreciateCoreStore from '../stores/core';

const state = useAppreciateCoreStore();

const {
  viewedItemId: viewedInstrumentId,
  isViewedItemId: isViewedInstrumentId,
  setViewedItemId: setViewedInstrumentId
} = usePivot(constants.TOTALS);

const viewedGraphId = ref<string>(constants.GRAPH_BALANCES_OVER_TIME);
const activeGraph = computed<GraphConfig>(() => state.graphs[viewedGraphId.value]);
const setViewedGraphId = (graphId) => viewedGraphId.value = graphId;

const buttons: Array<Button> = Object.keys(state.graphs).map((graphId) => ({
  text: graphId,
  onClick: () => setViewedGraphId(graphId),
}));

watch(() => state.instruments, async (instruments) => {
  if (!instruments.map((instrument) => instrument.id).includes(viewedInstrumentId.value)) {
    setViewedInstrumentId(constants.TOTALS);
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
        <base-menu :text="constants.BTN_SELECT" :buttons="buttons" />
      </div>
    </div>
    <div :class="['tabframe', 'w-fit']">
      <base-tabs
        :get-item-name="state.getInstrumentName"
        :pivot="state.instrumentsWithTotals"
        :is-viewed-item-id="isViewedInstrumentId"
        :set-viewed-item-id="setViewedInstrumentId"
      >
        <template #tabContent>
          <base-graph
            :key="viewedInstrumentId"
            :graph="activeGraph"
            :anchor-id="viewedInstrumentId"
          />
        </template>
      </base-tabs>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  padding-left: 2rem; /* room for Y axis */
  overflow: visible;
}
</style>
