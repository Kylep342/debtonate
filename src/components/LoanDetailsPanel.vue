<script setup>
import { computed, ref, watch } from 'vue';

import AmortizationTable from './AmortizationTable.vue';
import RefinancingTable from './RefinancingTable.vue';
import constants from '../constants/constants';
import useCoreStore from '../stores/core';

const coreState = useCoreStore();
const currentLoan = ref(null);
const viewedBudgetId = ref(constants.DEFAULT);

const title = computed(() => coreState.buildLoanDetailsTitle(currentLoan.value));

const isViewedBudgetId = (itemId) => viewedBudgetId.value === itemId;
const setViewedBudgetId = (itemId) => {
  viewedBudgetId.value = itemId;
};

watch(
  () => coreState.currentLoanId,
  (newId) => {
    if (newId && coreState.loanDetailsPanelActive) {
      currentLoan.value = coreState.getLoan(newId);
    }
  },
  { immediate: true },
);
</script>

<template>
  <base-modal :id="constants.LOAN_DETAILS_ID">
    <template #header>
      <h2>{{ title }}</h2>
    </template>
    <template #headerActions>
      <base-button
        :class="['btn btn-circle btn-ghost']"
        @click="coreState.unviewLoan"
      >
        x
      </base-button>
    </template>
    <template #body>
      <div
        v-if="currentLoan"
        :class="['tabframe', 'w-auto']"
      >
        <RefinancingTable
          v-if="coreState.refinancingScenarios[currentLoan.id]?.length"
          :parent-id="currentLoan.id"
          :scenarios="coreState.refinancingScenarios[currentLoan.id]"
        />
        <base-tabs
          :get-item-name="coreState.getBudgetName"
          :pivot="coreState.monthlyBudgets"
          :is-viewed-item-id="isViewedBudgetId"
          :set-viewed-item-id="setViewedBudgetId"
        >
          <template #tabContent>
            <AmortizationTable
              :payment-summary="coreState.getPaymentSummary(currentLoan.id, viewedBudgetId)"
              :title="coreState.buildAmortizationTableTitle(
                currentLoan,
                coreState.getBudget(viewedBudgetId),
              )"
              :subtitle="coreState.buildAmortizationTableSubtitle(
                currentLoan,
                coreState.getBudget(viewedBudgetId),
              )"
            />
          </template>
        </base-tabs>
      </div>
    </template>
  </base-modal>
</template>
