<script setup>
import { inject, reactive, ref } from 'vue';

import constants from '../constants/constants';

defineProps(['graphs']);

const loanPrimitives = inject('loanPrimitives');

const loansWithTotals = reactive(loanPrimitives.loansWithTotals);
const viewedLoanId = ref(constants.TOTALS);

const isViewedLoanId = (loanId) => viewedLoanId.value === loanId;

const setViewedLoanId = (loanId) => {
  viewedLoanId.value = loanId;
};
</script>

<template>
  <div>
    <div :class="['tabframe', 'w-fit']">
      <div :class="['tabs', 'flex', 'flex-row', 'join', 'join-horizontal', 'w-full', 'flex-grow']">
        <div v-for="loan in loansWithTotals" :key="loan.id"
          :class="['join-item', 'w-full', { 'border-t-2': isViewedLoanId(loan.id) }]">
          <base-button :class="['btn-ghost', 'w-full']" @click=setViewedLoanId(loan.id)>
            {{ loanPrimitives.getLoanName(loan.id) }}
          </base-button>
        </div>
      </div>
      <base-chart v-if="graphs[viewedLoanId]" :chartConfig="graphs[viewedLoanId]" :key="viewedLoanId" />
    </div>
  </div>
</template>
