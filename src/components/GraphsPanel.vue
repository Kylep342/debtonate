<script setup>
import { computed, ref } from 'vue';

import constants from '../constants/constants';
import useCoreStore from '../stores/core';

const state = useCoreStore();

const graphs = computed(() => ({
  [constants.GRAPH_BALANCES_OVER_TIME]: state.balancesOverTimeGraphs,
  [constants.GRAPH_PERCENT_OF_PAYMENT_TO_PRINCIPAL]: state.percentOfPaymentAsPrincaplGraphs,
}));

const viewedGraphId = ref(constants.GRAPH_BALANCES_OVER_TIME);

const setViewedGraphId = (graphId) => viewedGraphId.value = graphId;

const activeGraph = computed(() => graphs.value[viewedGraphId.value])

const viewedLoanId = ref(constants.TOTALS);

const setViewedLoanId = (loanId) => {
  viewedLoanId.value = loanId;
};

const isViewedLoanId = (loanId) => viewedLoanId.value === loanId;
</script>

<template>
  <div>
    <div :class="['card-actions', 'flow-root', 'p-0']">
      <div :class="['flex', 'justify-between', 'pr-4']">
        <h2 :class="['cardHeaderTitle', 'float-left', 'p-4']">
          {{ constants.GRAPHS }} - {{ viewedGraphId }}
        </h2>
        <div className="dropdown dropdown-bottom dropdown-end">
          <base-button>{{ constants.SELECT }}</base-button>
          <ul
            tabIndex="{0}"
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
          >
            <li
              v-for="(graphId) in Object.keys(graphs)"
              :key="graphId"
              @click="setViewedGraphId(graphId)"
            >
              <a>{{ graphId }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div :class="['tabframe', 'w-fit']">
      <base-tabs
        :get-item-name="state.getLoanName"
        :pivot="state.loansWithTotals"
        :is-viewed-item-id="isViewedLoanId"
        :set-viewed-item-id="setViewedLoanId"
      >
        <template #tabContent>
          <base-graph
            :key="viewedLoanId"
            :graph="activeGraph.graphs[viewedLoanId]"
            :x="activeGraph.x"
            :x-scale="activeGraph.xScale"
            :y="activeGraph.y"
            :y-scale="activeGraph.yScale"
            :hover-format="activeGraph.hoverFormat"
          />
        </template>
      </base-tabs>
    </div>
  </div>
</template>
