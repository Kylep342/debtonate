<script setup>
import { computed, ref, watch } from 'vue';

import AmortizationTable from './AmortizationTable.vue';
import constants from '../constants/constants';
import useCoreStore from '../stores/core';

const coreState = useCoreStore();
const currentBudget = ref(null);
const viewedLoanId = ref(constants.TOTALS);

const buildBudgetDetailsTitle = (monthlyBudget) => monthlyBudget
  ? `Budget Details - ${coreState.getBudgetName(monthlyBudget.id)} | `
    + `${coreState.Money(monthlyBudget.absolute)}/month `
    + `(+${coreState.Money(monthlyBudget.relative)}/month)`
  : constants.BUDGET_DETAILS;

const title = computed(() => (buildBudgetDetailsTitle(currentBudget.value)))

const isViewedLoanId = (itemId) => viewedLoanId.value === itemId;
const setViewedLoanId = (itemId) => {
  viewedLoanId.value = itemId;
};

watch(
  () => coreState.currentBudgetId,
  (newId) => {
    if (newId && coreState.budgetDetailsPanelActive) {
      currentBudget.value = coreState.getBudget(newId);
    }
  },
  { immediate: true },
);
</script>

<template>
  <base-modal :id="constants.BUDGET_DETAILS_ID">
    <template #header>
      <h2>{{ title }}</h2>
    </template>
    <template #headerActions>
      <base-button
        :class="['btn btn-circle btn-ghost']"
        @click="coreState.unviewBudget"
      >
        x
      </base-button>
    </template>
    <template #body>
      <div
        v-if="currentBudget"
        :class="['tabframe', 'w-auto']"
      >
        <base-tabs
          :get-item-name="coreState.getLoanName"
          :pivot="coreState.loansWithTotals"
          :is-viewed-item-id="isViewedLoanId"
          :set-viewed-item-id="setViewedLoanId"
        >
          <template #tabContent>
            <AmortizationTable
              :payment-summary="coreState.getPaymentSummary(viewedLoanId, currentBudget.id)"
              :title="coreState.buildAmortizationTableTitle(
                coreState.getLoan(viewedLoanId),
                currentBudget,
              )"
              :subtitle="coreState.buildAmortizationTableSubtitle(
                coreState.getLoan(viewedLoanId),
                currentBudget,
              )"
            />
          </template>
        </base-tabs>
      </div>
    </template>
  </base-modal>
</template>
