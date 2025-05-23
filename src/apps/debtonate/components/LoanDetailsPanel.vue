<script setup lang="ts">
import { ILoan } from 'moneyfunx';
import { computed, ref, watch } from 'vue';

import { usePivot } from '@/apps/shared/composables/usePivot';
import AmortizationTable from '@/apps/debtonate/components/AmortizationTable.vue';
import constants from '@/apps/debtonate/constants/constants';
import RefinancingTable from '@/apps/debtonate/components/RefinancingTable.vue';
import useDebtonateCoreStore from '@/apps/debtonate/stores/core';

const state = useDebtonateCoreStore();
const currentLoan = ref<ILoan>();
const { viewedItemId, isViewedItemId, setViewedItemId } = usePivot(constants.DEFAULT);

const buildLoanDetailsTitle = (loan: ILoan): string => loan
  ? `Loan Details - ${state.getLoanName(loan.id)} | `
  + `${state.buildLoanSubtitle(loan)}`
  : constants.LOAN_DETAILS;

const title = computed<string>(() => buildLoanDetailsTitle(currentLoan.value!));

watch(
  () => state.currentLoanId,
  (newId) => {
    if (newId && state.loanDetailsPanelActive) {
      currentLoan.value = state.getLoan(newId);
    }
  },
  { immediate: true },
);
</script>

<template>
  <base-modal @exit="state.unviewLoan">
    <template #header>
      <h2>{{ title }}</h2>
    </template>
    <template #headerActions>
      <base-button :class="['btn btn-circle btn-ghost']" @click="state.unviewLoan">
        x
      </base-button>
    </template>
    <template #body>
      <div v-if="currentLoan" :class="['tabframe', 'w-auto']">
        <RefinancingTable v-if="state.refinancingScenarios[currentLoan.id]?.length" :parent-id="currentLoan.id"
          :scenarios="state.refinancingScenarios[currentLoan.id]"
          :schedules="state.refinancingSchedules[currentLoan.id]" />
        <base-tabs :get-item-name="state.getBudgetName" :pivot="state.monthlyBudgets"
          :is-viewed-item-id="isViewedItemId" :set-viewed-item-id="setViewedItemId">
          <template #tabContent>
            <AmortizationTable :payment-schedule="state.getPaymentSchedule(currentLoan.id, viewedItemId)" :title="state.buildAmortizationTableTitle(
              currentLoan,
              state.getBudget(viewedItemId),
            )" :subtitle="state.buildAmortizationTableSubtitle(
                currentLoan,
                state.getBudget(viewedItemId),
              )" />
          </template>
        </base-tabs>
      </div>
    </template>
  </base-modal>
</template>
