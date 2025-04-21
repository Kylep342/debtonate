<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { Button } from '@/apps/shared/types/app';
import { GraphConfig } from '@/apps/shared/types/graph';
import { usePivot } from '@/apps/shared/composables/usePivot';
import constants from '@/apps/debtonate/constants/constants';
import useDebtonateCoreStore from '@/apps/debtonate/stores/core';

const state = useDebtonateCoreStore();

const {
  viewedItemId: viewedLoanId,
  isViewedItemId: isViewedLoanId,
  setViewedItemId: setViewedLoanId
} = usePivot(constants.TOTALS);

const viewedGraphId = ref<string>(constants.GRAPH_BALANCES_OVER_TIME);
const activeGraph = computed<GraphConfig>(() => state.graphs[viewedGraphId.value]);
const setViewedGraphId = (graphId) => viewedGraphId.value = graphId;

const buttons: Array<Button> = Object.keys(state.graphs).map((graphId) => ({
  text: graphId,
  onClick: () => setViewedGraphId(graphId),
}));

watch(() => state.loans, async (loans) => {
  if (!loans.map((loan) => loan.id).includes(viewedLoanId.value)) {
    setViewedLoanId(constants.TOTALS);
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
      <base-tabs :get-item-name="state.getLoanName" :pivot="state.loansWithTotals"
        :is-viewed-item-id="isViewedLoanId" :set-viewed-item-id="setViewedLoanId">
        <template #tabContent>
          <!-- TODO: Move to split config/lines model -->
          <base-graph :key="viewedLoanId" :graph="activeGraph" :anchor-id="viewedLoanId" />
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
