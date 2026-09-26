<script setup lang="ts">
import { loan, paymentTypes } from 'moneyfunx';
import { computed, ref, watch, ComputedRef, Ref } from 'vue';

import constants from '@/apps/debtonate/constants/constants';
import TabularAnalysis from '@/apps/shared/components/TabularAnalysis.vue';
import { useDebtonateCoreStore, DebtonateCoreStore } from '@/apps/debtonate/stores/core';
import { usePivot } from '@/apps/shared/composables/usePivot';
import { useBreakpoint } from '@/apps/shared/functions/viewport';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { Button } from '@/apps/shared/types/app';
import { MonthlyBudget } from '@/apps/shared/types/core';
import { UIDebtLoan } from '@/apps/debtonate/types/core';

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
const state: DebtonateCoreStore = useDebtonateCoreStore();
const { isMobile } = useBreakpoint();

const currentBudget: Ref<MonthlyBudget|null> = ref(null);

const { viewedItemId, setViewedItemId } = usePivot(constants.TOTALS);

const currentLoan: ComputedRef<loan.ILoan | UIDebtLoan | null> = computed(() => {
  if (!viewedItemId.value) return null;
  return state.getLoan(viewedItemId.value) || null;
});

const paymentSchedule: ComputedRef<paymentTypes.PaymentSchedule> = computed(() => {
  if (!currentBudget.value || !viewedItemId.value) {
    return {
      lifetimeInterest: 0n,
      lifetimePrincipal: 0n,
      amortizationSchedule: [],
    };
  }
  return state.getPaymentSchedule(viewedItemId.value, currentBudget.value.id);
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
  if (!paymentSchedule.value) return {};
  return state.amortizationTableTotals(paymentSchedule.value);
})

const panelTitle = computed(() => (
  currentBudget.value
    ? `Budget Details - ${state.getBudgetName(currentBudget.value.id)}`
    : constants.BUDGET_DETAILS
));

const panelSubtitle = computed(() => {
  if (!currentBudget.value) return '';
  return `${globalOptions.Money(currentBudget.value.absolute)}/month (+${globalOptions.Money(currentBudget.value.relative)} over minimum)`;
});

const activeView = ref<'amortization' | 'comparative'>('amortization');

const scheduleTabLabel = computed(() => (
  isMobile.value ? 'Schedule' : 'Amortization Schedule'
));

const comparativeTabLabel = computed(() => (
  isMobile.value ? 'Comparison' : 'Comparative Analysis'
));

const loanDropdownLabel = computed(() => (
  viewedItemId.value ? state.getLoanName(viewedItemId.value) : 'Select Loan'
));

const loanDropdownButtons = computed<Button[]>(() =>
  state.loansWithTotals.map((loanItem) => ({
    text: state.getLoanName(loanItem.id),
    onClick: () => setViewedItemId(loanItem.id),
  }))
);

const loanComparativeAnalysis = computed(() => {
  if (!viewedItemId.value) return {};
  return state.getLoanComparativeAnalysis(viewedItemId.value);
});

watch(
  () => state.currentBudgetId,
  (newId) => {
    if (newId && state.budgetDetailsPanelActive) {
      currentBudget.value = state.getBudget(newId)!;
    }
  },
  { immediate: true },
);
</script>

<template>
  <base-modal
    :id="constants.BUDGET_DETAILS_ID"
    :max-width="'4xl'"
    @exit="state.unviewBudget"
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
        @click="state.unviewBudget"
      >
        x
      </base-button>
    </template>
    <template #body>
      <div
        v-if="currentBudget"
        class="p-3 sm:p-4 flex flex-col gap-4"
      >
        <!-- Top Stat Ribbon -->
        <div class="bg-base-200/50 rounded-xl p-3.5 border border-base-content/10 shadow-sm grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <span class="text-base-content/60 text-[11px] block">Monthly Budget</span>
            <span class="font-mono font-bold text-sm sm:text-base text-base-content">
              {{ globalOptions.Money(currentBudget.absolute) }}/mo
            </span>
          </div>
          <div>
            <span class="text-base-content/60 text-[11px] block">Over Minimum</span>
            <span class="font-mono font-bold text-sm sm:text-base text-success">
              +{{ globalOptions.Money(currentBudget.relative) }}/mo
            </span>
          </div>
          <div class="col-span-2 sm:col-span-1 flex items-center justify-between sm:block border-t border-base-content/10 pt-2.5 sm:border-t-0 sm:pt-0">
            <span class="text-base-content/60 text-[11px] block whitespace-nowrap">Baseline Minimum</span>
            <span class="font-mono font-bold text-sm sm:text-base text-base-content">
              {{ globalOptions.Money(state.totalMinPayment) }}/mo
            </span>
          </div>
        </div>

        <!-- Paired Navigation Tabs & Focused Vehicle Dropdown -->
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
            <span class="text-xs text-base-content/60 font-medium">Vehicle:</span>
            <base-menu
              :text="loanDropdownLabel"
              :buttons="loanDropdownButtons"
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

        <!-- Tab 2: Dynamic Crosstab Comparative Analysis (Budgets compared for selected vehicle) -->
        <div
          v-else-if="activeView === 'comparative'"
          class="w-auto"
        >
          <TabularAnalysis
            :title="`${state.getLoanName(viewedItemId || constants.TOTALS)} - Budget Comparison`"
            :subtitle="`Comparing all payment budgets for ${state.getLoanName(viewedItemId || constants.TOTALS)}`"
            :analysis="loanComparativeAnalysis"
            :items="state.monthlyBudgets"
            :get-item-name="state.getBudgetName"
            :baseline-id="currentBudget.id"
          />
        </div>
      </div>
    </template>
    <template #actions>
      <div class="flex items-center justify-end w-full">
        <base-button
          class="btn-sm btn-primary"
          @click="state.unviewBudget"
        >
          Done
        </base-button>
      </div>
    </template>
  </base-modal>
</template>
