<script setup>
import { inject, reactive, ref } from 'vue';

import constants from '../constants/constants';

const loanPrimitives = inject('loanPrimitives');
const visuals = inject('visuals');
const graphsConfig = ref(visuals.balanceOverTimeGraphs);

const loansWithTotals = reactive(loanPrimitives.loansWithTotals);
const viewedLoanId = ref(constants.TOTALS);

const setViewedLoanId = (value) => {
  viewedLoanId.value = value;
};
</script>

<template>
  <div>
    <div :class="['tabframe', 'w-fit']">
      <div :class="['tabs', 'flex', 'flex-row', 'join', 'join-horizontal', 'w-full', 'flex-grow']">
        <div v-for="loan in loansWithTotals" :key="loan.id"
          :class="['join-item', 'w-full', { 'border-t-2': loan.id === viewedLoanId }]">
          <base-button :class="['btn-ghost', 'w-full']" @click=setViewedLoanId(loan.id)>{{
            loanPrimitives.getLoanName(loan.id)
          }}</base-button>
        </div>
      </div>
      <base-chart :chartConfig="graphsConfig[viewedLoanId]" />
    </div>
  </div>
</template>
