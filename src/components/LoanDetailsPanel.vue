<script setup lang="ts">
import { ILoan } from 'moneyfunx';
import { computed, ref, watch } from 'vue';

import AmortizationTable from '@/components/AmortizationTable.vue';
import RefinancingTable from '@/components/RefinancingTable.vue';
import { usePivot } from '@/composables/usePivot';
import constants from '@/constants/constants';
import useCoreStore from '@/stores/core';

const coreState = useCoreStore();
const currentLoan = ref<ILoan>();
const { viewedItemId, isViewedItemId, setViewedItemId } = usePivot(constants.DEFAULT);

const buildLoanDetailsTitle = (loan: ILoan): string => loan
  ? `Loan Details - ${coreState.getLoanName(loan.id)} | `
  + `${coreState.buildLoanSubtitle(loan)}`
  : constants.LOAN_DETAILS;

const title = computed<string>(() => buildLoanDetailsTitle(currentLoan.value!));

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
  <base-modal :id="constants.LOAN_DETAILS_ID" @exit="coreState.unviewLoan">
    <template #header>
      <h2>{{ title }}</h2>
    </template>
    <template #headerActions>
      <base-button :class="['btn btn-circle btn-ghost']" @click="coreState.unviewLoan">
        x
      </base-button>
    </template>
    <template #body>
      <div v-if="currentLoan" :class="['tabframe', 'w-auto']">
        <RefinancingTable v-if="coreState.refinancingScenarios[currentLoan.id]?.length" :parent-id="currentLoan.id"
          :scenarios="coreState.refinancingScenarios[currentLoan.id]"
          :schedules="coreState.refinancingSchedules[currentLoan.id]" />
        <base-tabs :get-item-name="coreState.getBudgetName" :pivot="coreState.monthlyBudgets"
          :is-viewed-item-id="isViewedItemId" :set-viewed-item-id="setViewedItemId">
          <template #tabContent>
            <AmortizationTable :payment-schedule="coreState.getPaymentSchedule(currentLoan.id, viewedItemId)" :title="coreState.buildAmortizationTableTitle(
              currentLoan,
              coreState.getBudget(viewedItemId),
            )" :subtitle="coreState.buildAmortizationTableSubtitle(
                currentLoan,
                coreState.getBudget(viewedItemId),
              )" />
          </template>
        </base-tabs>
      </div>
    </template>
  </base-modal>
</template>
