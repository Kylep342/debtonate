<script setup>
import { computed, ref } from 'vue';

import constants from '../constants/constants';
import useCoreStore from '../stores/core';

const coreState = useCoreStore();

const viewedGraphId = ref(constants.GRAPH_BALANCES_OVER_TIME);
const viewedLoanId = ref(constants.TOTALS);

const activeGraph = computed(() => coreState.graphs[viewedGraphId.value]);

const isViewedLoanId = (loanId) => viewedLoanId.value === loanId;
const setViewedGraphId = (graphId) => viewedGraphId.value = graphId;
const setViewedLoanId = (loanId) => {
  viewedLoanId.value = loanId;
};

</script>

<template>
  <div>
    <div :class="['card-actions', 'flow-root', 'p-0']">
      <div :class="['flex', 'justify-between', 'pr-4']">
        <h2 :class="['cardHeaderTitle', 'float-left', 'p-4']">
          {{ constants.GRAPHS }} - {{ viewedGraphId }}
        </h2>
        <div className="dropdown dropdown-bottom dropdown-end">
          <base-button>{{ constants.BTN_SELECT }}</base-button>
          <ul
            tabIndex="{0}"
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
          >
            <li
              v-for="(graphId) in Object.keys(coreState.graphs)"
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
        :get-item-name="coreState.getLoanName"
        :pivot="coreState.loansWithTotals"
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
            :y-format="activeGraph.yFormat"
            :y-scale="activeGraph.yScale"
            :line-name="activeGraph.lineName"
          />
        </template>
      </base-tabs>
    </div>
  </div>
</template>
