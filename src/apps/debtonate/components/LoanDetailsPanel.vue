<script setup lang="ts">
import moneyfunx from 'moneyfunx';
import { computed, ref, watch, ComputedRef, Ref } from 'vue';

import constants from '@/apps/debtonate/constants/constants';
import RefinancingTable from '@/apps/debtonate/components/RefinancingTable.vue';
import { useDebtonateCoreStore, DebtonateCoreStore } from '@/apps/debtonate/stores/core';
import { usePivot } from '@/apps/shared/composables/usePivot';
import { MonthlyBudget } from '@/apps/shared/types/core';

const state: DebtonateCoreStore = useDebtonateCoreStore();

const currentLoan: Ref<moneyfunx.ILoan|null> = ref(null);

const { viewedItemId, isViewedItemId, setViewedItemId } = usePivot(constants.DEFAULT);

const currentBudget: ComputedRef<MonthlyBudget|null> = computed(() => {
  if (!viewedItemId.value) return null;
  return state.getBudget(viewedItemId.value)!;
});

const paymentSchedule: ComputedRef<moneyfunx.PaymentSchedule> = computed(() => {
  if (!currentLoan.value || !viewedItemId.value) return <moneyfunx.PaymentSchedule>{};
  return state.getPaymentSchedule(currentLoan.value.id, viewedItemId.value);
});

const amortizationTitle: ComputedRef<string> = computed(() => {
  if (!currentLoan.value || !currentBudget.value) return '';
  return state.buildAmortizationTableTitle(currentLoan.value, currentBudget.value);
});

const amortizationSubtitle: ComputedRef<string> = computed(() => {
  if (!currentLoan.value || !currentBudget.value) return '';
  return state.buildAmortizationTableSubtitle(currentLoan.value, currentBudget.value);
});

const tableRows: ComputedRef<{}[]> = computed(() => {
  if (!paymentSchedule.value) return [];
  return state.amortizationTableRows(paymentSchedule.value)
});

const tableFooter: ComputedRef<{}> = computed(() => {
  if (!paymentSchedule.value) return [];
  return state.amortizationTableTotals(paymentSchedule.value)
});


const buildLoanDetailsTitle = (loan: moneyfunx.ILoan): string => loan
  ? `Loan Details - ${state.getLoanName(loan.id)} | `
  + `${state.buildLoanSubtitle(loan)}`
  : constants.LOAN_DETAILS;

const title: ComputedRef<string> = computed(() => buildLoanDetailsTitle(currentLoan.value!));

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
  <base-modal :id="constants.LOAN_DETAILS_ID" @exit="state.unviewLoan">
    <template #header>
      <h2 :class="['pl-4']">{{ title }}</h2>
    </template>
    <template #headerActions>
      <base-button :class="['btn btn-circle btn-ghost']" @click="state.unviewLoan">
        x
      </base-button>
    </template>
    <template #body>
      <div v-if="currentLoan" :class="['tabframe', 'w-auto']">
        <RefinancingTable
          v-if="state.refinancingScenarios[currentLoan.id]?.length"
          :parent-id="currentLoan.id"
          :scenarios="state.refinancingScenarios[currentLoan.id]"
          :schedules="state.refinancingSchedules[currentLoan.id]"
        />
        <base-tabs
          :get-item-name="state.getBudgetName"
          :pivot="state.monthlyBudgets"
          :is-viewed-item-id="isViewedItemId"
          :set-viewed-item-id="setViewedItemId"
        >
          <template #tabContent>
            <data-table
              :title="amortizationTitle"
              :subtitle="amortizationSubtitle"
              :headers="state.amortizationTableHeaders"
              :rows="tableRows"
              :totals="tableFooter"
            />
          </template>
        </base-tabs>
      </div>
    </template>
  </base-modal>
</template>
