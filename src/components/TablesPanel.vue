<script setup>
import { ref } from 'vue';

import InterestTable from './InterestTable.vue';
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
      <div :class="['tabs', 'flex', 'flex-row', 'join', 'join-horizontal', 'w-full', 'flex-grow']">
        <div v-for="loan in state.loansWithTotals" :key="loan.id"
          :class="['join-item', 'w-full', { 'border-t-2': isViewedLoanId(loan.id) }]">
          <base-button :class="['btn-ghost', 'w-full']" @click=setViewedLoanId(loan.id)>
            {{ state.getLoanName(loan.id) }}
          </base-button>
        </div>
      </div>
      <InterestTable :id="'interestTable'" :loanId="viewedLoanId"
        :title="state.buildInterestTableTitle(state.getLoan(viewedLoanId))"
        :subtitle="state.buildInterestTableSubtitle(state.getLoan(viewedLoanId))" />
    </div>
  </div>
</template>
