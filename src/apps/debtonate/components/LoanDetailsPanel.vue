<script setup lang="ts">
import { loan, paymentTypes } from 'moneyfunx';
import { computed, ref, watch, ComputedRef, Ref } from 'vue';

import constants from '@/apps/debtonate/constants/constants';
import RefinancingTable from '@/apps/debtonate/components/RefinancingTable.vue';
import TabularAnalysis from '@/apps/shared/components/TabularAnalysis.vue';
import { useDebtonateCoreStore, DebtonateCoreStore } from '@/apps/debtonate/stores/core';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { usePivot } from '@/apps/shared/composables/usePivot';
import { useBreakpoint } from '@/apps/shared/functions/viewport';
import { Button } from '@/apps/shared/types/app';
import { MonthlyBudget } from '@/apps/shared/types/core';
import { UIDebtLoan } from '@/apps/debtonate/types/core';

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
const state: DebtonateCoreStore = useDebtonateCoreStore();
const { isMobile } = useBreakpoint();

const currentLoan: Ref<loan.ILoan | UIDebtLoan | null> = ref(null);

const { viewedItemId, setViewedItemId } = usePivot(constants.DEFAULT);

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

const panelTitle = computed(() => (
  currentLoan.value
    ? `Loan Details - ${state.getLoanName(currentLoan.value.id)}`
    : constants.LOAN_DETAILS
));

const panelSubtitle = computed(() => (
  currentLoan.value ? state.buildLoanSubtitle(currentLoan.value) : ''
));

const activeView = ref<'amortization' | 'comparative'>('amortization');

const scheduleTabLabel = computed(() => (
  isMobile.value ? 'Schedule' : 'Amortization Schedule'
));

const comparativeTabLabel = computed(() => (
  isMobile.value ? 'Comparison' : 'Comparative Analysis'
));

const budgetDropdownLabel = computed(() => (
  viewedItemId.value ? state.getBudgetName(viewedItemId.value) : 'Select Budget'
));

const budgetDropdownButtons = computed<Button[]>(() =>
  state.monthlyBudgets.map((budget) => ({
    text: state.getBudgetName(budget.id),
    onClick: () => setViewedItemId(budget.id),
  }))
);

const loanComparativeAnalysis = computed(() => {
  if (!currentLoan.value) return {};
  return state.getLoanComparativeAnalysis(currentLoan.value.id);
});

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
      <div class="flex flex-col min-w-0 pr-2">
        <h2 class="text-base sm:text-lg md:text-xl font-bold tracking-tight text-base-content truncate">
          {{ panelTitle }}
        </h2>
        <p
          v-if="panelSubtitle"
          class="hidden sm:block text-xs text-base-content/60 font-mono truncate mt-0.5"
        >
          {{ panelSubtitle }}
        </p>
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

        <!-- Paired Navigation Tabs & Budget Dropdown -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-base-content/10 pb-2">
          <div class="tabs tabs-boxed bg-base-300/40 p-1 rounded-xl grid grid-cols-2 w-full sm:w-auto sm:flex">
            <button
              type="button"
              class="tab tab-sm font-medium transition-all whitespace-nowrap flex-1 text-center"
              :class="{ 'tab-active font-bold': activeView === 'amortization' }"
              @click="activeView = 'amortization'"
            >
              {{ scheduleTabLabel }}
            </button>
            <button
              type="button"
              class="tab tab-sm font-medium transition-all whitespace-nowrap flex-1 text-center"
              :class="{ 'tab-active font-bold': activeView === 'comparative' }"
              @click="activeView = 'comparative'"
            >
              {{ comparativeTabLabel }}
            </button>
          </div>

          <div class="flex items-center justify-between sm:justify-end gap-2">
            <span class="text-xs text-base-content/60 font-medium">Budget:</span>
            <base-menu
              :text="budgetDropdownLabel"
              :buttons="budgetDropdownButtons"
              :classes="['btn-sm', 'btn-outline']"
              align="end"
            />
          </div>
        </div>

        <!-- Tab 1: Amortization Schedule (Direct Table, No Pivot Tabs) -->
        <div
          v-if="activeView === 'amortization'"
          class="w-auto"
        >
          <data-table
            :title="amortizationTitle"
            :subtitle="amortizationSubtitle"
            :headers="state.amortizationTableHeaders"
            :rows="tableRows"
            :totals="tableFooter"
          />
        </div>

        <!-- Tab 2: Dynamic Crosstab Comparative Analysis -->
        <div
          v-else-if="activeView === 'comparative'"
          class="w-auto"
        >
          <TabularAnalysis
            :title="`${state.getLoanName(currentLoan.id)} - Budget Comparison`"
            subtitle="Comparing how this loan performs across all repayment budgets"
            :analysis="loanComparativeAnalysis"
            :items="state.monthlyBudgets"
            :get-item-name="state.getBudgetName"
            :baseline-id="viewedItemId"
            @select-baseline="setViewedItemId"
          />
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
