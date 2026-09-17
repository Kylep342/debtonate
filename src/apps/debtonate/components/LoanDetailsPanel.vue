<script setup lang="ts">
import { loan, paymentTypes } from 'moneyfunx';
import { computed, ref, watch, ComputedRef, Ref } from 'vue';

import constants from '@/apps/debtonate/constants/constants';
import RefinancingTable from '@/apps/debtonate/components/RefinancingTable.vue';
import { useDebtonateCoreStore, DebtonateCoreStore } from '@/apps/debtonate/stores/core';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { usePivot } from '@/apps/shared/composables/usePivot';
import { MonthlyBudget } from '@/apps/shared/types/core';
import { UIDebtLoan } from '@/apps/debtonate/types/core';

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
const state: DebtonateCoreStore = useDebtonateCoreStore();

const currentLoan: Ref<loan.ILoan | UIDebtLoan | null> = ref(null);

const { viewedItemId, isViewedItemId, setViewedItemId } = usePivot(constants.DEFAULT);

const currentBudget: ComputedRef<MonthlyBudget|null> = computed(() => {
  if (!viewedItemId.value) return null;
  return state.getBudget(viewedItemId.value)!;
});

const paymentSchedule: ComputedRef<paymentTypes.PaymentSchedule> = computed(() => {
  if (!currentLoan.value || !viewedItemId.value) {
    return {
      lifetimeInterest: 0n,
      lifetimePrincipal: 0n,
      amortizationSchedule: [],
    };
  }
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
  return state.amortizationTableRows(paymentSchedule.value);
});

const tableFooter: ComputedRef<{}> = computed(() => {
  if (!paymentSchedule.value) return [];
  return state.amortizationTableTotals(paymentSchedule.value);
});

const buildLoanDetailsTitle = (loanItem: loan.ILoan | UIDebtLoan): string => loanItem
  ? `Loan Details - ${state.getLoanName(loanItem.id)} | `
  + `${state.buildLoanSubtitle(loanItem)}`
  : constants.LOAN_DETAILS;

const title: ComputedRef<string> = computed(() => currentLoan.value ? buildLoanDetailsTitle(currentLoan.value) : constants.LOAN_DETAILS);

watch(
  () => state.currentLoanId,
  (newId) => {
    if (newId && state.loanDetailsPanelActive) {
      currentLoan.value = state.getLoan(newId) || null;
    }
  },
  { immediate: true },
);
</script>

<template>
  <base-modal
    :id="constants.LOAN_DETAILS_ID"
    :max-width="'4xl'"
    @exit="state.unviewLoan"
  >
    <template #header>
      <div class="flex items-center gap-2 pl-2">
        <h2 class="text-lg md:text-xl font-bold tracking-tight text-base-content">
          {{ title }}
        </h2>
      </div>
    </template>
    <template #headerActions>
      <base-button
        class="btn btn-circle btn-ghost btn-sm"
        @click="state.unviewLoan"
      >
        x
      </base-button>
    </template>
    <template #body>
      <div
        v-if="currentLoan"
        class="p-3 sm:p-4 flex flex-col gap-4"
      >
        <!-- Top Stat Ribbon -->
        <div class="bg-base-200/50 rounded-xl p-3.5 border border-base-content/10 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span class="text-base-content/60 text-[11px] block">Current Balance</span>
            <span class="font-mono font-bold text-sm sm:text-base text-base-content">
              {{ globalOptions.Money(currentLoan.currentBalance) }}
            </span>
          </div>
          <div>
            <span class="text-base-content/60 text-[11px] block">Interest Rate</span>
            <span class="font-mono font-bold text-sm sm:text-base text-secondary">
              {{ (Number(currentLoan.annualRate) * 100).toFixed(2) }}% APR
            </span>
          </div>
          <div>
            <span class="text-base-content/60 text-[11px] block">Minimum Monthly</span>
            <span class="font-mono font-bold text-sm sm:text-base text-base-content">
              {{ globalOptions.Money(currentLoan.minPayment) }}
            </span>
          </div>
          <div>
            <span class="text-base-content/60 text-[11px] block">Original Term</span>
            <span class="font-mono font-bold text-sm sm:text-base text-base-content">
              {{ currentLoan.termInYears }} Years
            </span>
          </div>
        </div>

        <!-- Refinancing Scenarios (if available) -->
        <RefinancingTable
          v-if="state.refinancingScenarios[currentLoan.id]?.length"
          :parent-id="currentLoan.id"
          :scenarios="state.refinancingScenarios[currentLoan.id]"
          :schedules="state.refinancingSchedules[currentLoan.id]"
        />

        <!-- Amortization Schedules Pivot -->
        <div class="tabframe w-auto">
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
      </div>
    </template>
    <template #actions>
      <div class="flex items-center justify-end w-full">
        <base-button
          class="btn-sm btn-primary"
          @click="state.unviewLoan"
        >
          Done
        </base-button>
      </div>
    </template>
  </base-modal>
</template>
