<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import constants from '@/constants/constants';
import useCoreStore from '@/stores/core';
import { GraphConfig } from '@/types/graph';

const coreState = useCoreStore();

const viewedGraphId = ref<string>(constants.GRAPH_BALANCES_OVER_TIME);
const viewedLoanId = ref<string>(constants.TOTALS);

const activeGraph = computed<GraphConfig>(() => coreState.graphs[viewedGraphId.value]);

const isViewedLoanId = (loanId) => viewedLoanId.value === loanId;
const setViewedGraphId = (graphId) => viewedGraphId.value = graphId;
const setViewedLoanId = (loanId) => viewedLoanId.value = loanId;

const buttons = Object.keys(coreState.graphs).map((graphId) => ({
  text: graphId,
  onClick: () => setViewedGraphId(graphId),
}));

watch(() => coreState.loans, async (value) => {
  if (!value.map((loan) => loan.id).includes(viewedLoanId.value)) {
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
        <base-menu
          :menu="constants.BTN_SELECT"
          :buttons="buttons"
        />
      </div>
    </div>
    <div :class="['tabframe', 'w-fit']">
      <base-tabs
        :get-item-name="coreState.getLoanName"
        :pivot="coreState.loansWithTotals"
        :is-viewed-item-id="isViewedLoanId"
        :set-viewed-item-id="setViewedLoanId"
      >
        <template #tabContent>
          <base-graph
            :key="viewedLoanId"
            :graph="activeGraph"
            :anchor-id="viewedLoanId"
          />
        </template>
      </base-tabs>
    </div>
  </div>
</template>
