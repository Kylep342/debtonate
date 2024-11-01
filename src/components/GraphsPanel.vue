<script setup>
import { ref } from 'vue';

import constants from '../constants/constants';
import useCoreStore from '../stores/core';

const state = useCoreStore();

const viewedLoanId = ref(constants.TOTALS);

const isViewedLoanId = (loanId) => viewedLoanId.value === loanId;

const setViewedLoanId = (loanId) => {
  viewedLoanId.value = loanId;
};
</script>

<template>
  <div>
    <div :class="['tabframe', 'w-fit']">
      <base-tabs
        :get-item-name="state.getLoanName"
        :pivot="state.loansWithTotals"
        :is-viewed-item-id="isViewedLoanId"
        :set-viewed-item-id="setViewedLoanId"
      >
        <template #tabContent>
          <base-chart
            v-if="state.balanceOverTimeGraphs[viewedLoanId]"
            :key="viewedLoanId"
            :chart-config="state.balanceOverTimeGraphs[viewedLoanId]"
          />
        </template>
      </base-tabs>
    </div>
  </div>
</template>
