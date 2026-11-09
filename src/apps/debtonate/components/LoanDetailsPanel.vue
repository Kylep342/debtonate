<script setup lang="ts">
import { loan, paymentTypes } from 'moneyfunx';
import { computed, ref, watch, ComputedRef, Ref } from 'vue';

import constants from '@/apps/debtonate/constants/constants';
import elementIds from '@/apps/shared/constants/elementIds';
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
const selectedScenarioId: Ref<string | null> = ref(null);

const { viewedItemId, setViewedItemId } = usePivot(constants.DEFAULT);

const scenarios = computed<UIDebtLoan[]>(() => {
  if (!currentLoan.value) return [];
  return state.refinancingScenarios[currentLoan.value.id] || [];
});

const hasRefinancingScenarios = computed<boolean>(() => scenarios.value.length > 0);

const loanAndScenarios = computed<(loan.ILoan | UIDebtLoan)[]>(() => {
  if (!currentLoan.value) return [];
  return [currentLoan.value, ...scenarios.value];
});

const activeScenario = computed<loan.ILoan | UIDebtLoan | null>(() => {
  if (!currentLoan.value) return null;
  if (selectedScenarioId.value) {
    const found = loanAndScenarios.value.find((s) => s.id === selectedScenarioId.value);
    if (found) return found;
  }
  return currentLoan.value;
});

const setSelectedScenarioId = (id: string) => {
  selectedScenarioId.value = id;
};

const currentBudget: ComputedRef<MonthlyBudget|null> = computed(() => {
  if (!viewedItemId.value) return null;
  return state.getBudget(viewedItemId.value)!;
});

const paymentSchedule: ComputedRef<paymentTypes.PaymentSchedule> = computed(() => {
  if (!activeScenario.value || !viewedItemId.value) {
    return {
      lifetimeInterest: 0n,
      lifetimePrincipal: 0n,
      amortizationSchedule: [],
    };
  }
  return state.getPaymentSchedule(activeScenario.value.id, viewedItemId.value);
});

const amortizationTitle: ComputedRef<string> = computed(() => {
  if (!activeScenario.value || !currentBudget.value) return '';
  return state.buildAmortizationTableTitle(activeScenario.value, currentBudget.value);
});

const amortizationSubtitle: ComputedRef<string> = computed(() => {
  if (!activeScenario.value || !currentBudget.value) return '';
  return state.buildAmortizationTableSubtitle(activeScenario.value, currentBudget.value);
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
  activeScenario.value ? state.buildLoanSubtitle(activeScenario.value) : ''
));

const activeView = ref<'amortization' | 'comparative'>('amortization');

const scheduleTabLabel = computed(() => (
  isMobile.value ? 'Schedule' : 'Amortization Schedule'
));

const comparativeTabLabel = computed(() => (
  isMobile.value ? 'Comparison' : 'Comparative Analysis'
));

const scenarioDropdownLabel = computed(() => (
  activeScenario.value ? state.getLoanName(activeScenario.value.id) : 'Select Scenario'
));

const scenarioDropdownButtons = computed<Button[]>(() =>
  loanAndScenarios.value.map((item) => ({
    text: state.getLoanName(item.id),
    onClick: () => setSelectedScenarioId(item.id),
  }))
);

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
  if (!activeScenario.value) return {};
  return state.getLoanComparativeAnalysis(activeScenario.value.id);
});

const refinancingComparativeAnalysis = computed(() => {
  if (!currentLoan.value) return {};
  return state.getRefinancingComparativeAnalysis(
    currentLoan.value.id,
    viewedItemId.value || constants.DEFAULT
  );
});

const canDeleteScenario = (id: string): boolean =>
  Boolean(currentLoan.value && id !== currentLoan.value.id);

const handleDeleteScenario = (scenarioId: string): void => {
  if (!currentLoan.value) return;
  state.deleteRefinancingScenario(currentLoan.value.id, scenarioId);
  if (selectedScenarioId.value === scenarioId) {
    selectedScenarioId.value = currentLoan.value.id;
  }
};

watch(
  () => state.currentLoanId,
  (newId) => {
    if (newId && state.loanDetailsPanelActive) {
      currentLoan.value = state.getLoan(newId) || null;
      selectedScenarioId.value = newId;
    }
  },
  { immediate: true },
);

watch(
  scenarios,
  (newScenarios) => {
    if (
      currentLoan.value &&
      selectedScenarioId.value &&
      selectedScenarioId.value !== currentLoan.value.id &&
      !newScenarios.some((s) => s.id === selectedScenarioId.value)
    ) {
      selectedScenarioId.value = currentLoan.value.id;
    }
  }
);
</script>

<template>
  <base-modal
    :id="constants.LOAN_DETAILS_ID"
    :max-width="'4xl'"
    composite-size="details"
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
        v-if="currentLoan && activeScenario"
        class="flex flex-col gap-3 sm:gap-4 flex-1 min-h-0 h-full"
      >
        <!-- Top Stat Ribbon -->
        <div class="bg-base-200/50 rounded-xl p-3.5 border border-base-content/10 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs shrink-0">
          <div>
            <span class="text-base-content/60 text-[11px] block">Current Balance</span>
            <span class="font-mono font-bold text-sm sm:text-base text-base-content">
              {{ globalOptions.Money(activeScenario.currentBalance) }}
            </span>
          </div>
          <div>
            <span class="text-base-content/60 text-[11px] block">Interest Rate</span>
            <span class="font-mono font-bold text-sm sm:text-base text-secondary">
              {{ (Number(activeScenario.annualRate) * 100).toFixed(2) }}% APR
            </span>
          </div>
          <div>
            <span class="text-base-content/60 text-[11px] block">Minimum Monthly</span>
            <span class="font-mono font-bold text-sm sm:text-base text-base-content">
              {{ globalOptions.Money(activeScenario.minPayment) }}
            </span>
          </div>
          <div>
            <span class="text-base-content/60 text-[11px] block">Original Term</span>
            <span class="font-mono font-bold text-sm sm:text-base text-base-content">
              {{ activeScenario.termInYears }} Years
            </span>
          </div>
        </div>

        <!-- Conditional Refinancing Prompt Bar -->
        <div
          v-if="!hasRefinancingScenarios"
          :id="elementIds.BAR_REFINANCE_PROMPT"
          class="bg-secondary/10 border border-secondary/25 rounded-xl px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shrink-0"
        >
          <span class="text-base-content/80 font-medium">
            Refinance this loan to see a head-to-head scenario comparison.
          </span>
          <base-button
            :id="elementIds.BTN_DETAILS_REFINANCE"
            class="btn-xs btn-secondary self-end sm:self-auto shrink-0"
            @click="state.refinanceLoan(currentLoan.id)"
          >
            {{ constants.BTN_REFINANCE }}
          </base-button>
        </div>

        <!-- Paired Navigation Tabs & Pivot Dropdowns -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-base-content/10 pb-2 shrink-0">
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

          <div class="flex flex-wrap items-center justify-between sm:justify-end gap-2">
            <div
              v-if="hasRefinancingScenarios"
              class="flex items-center gap-2"
            >
              <span class="text-xs text-base-content/60 font-medium">Scenario:</span>
              <base-menu
                :text="scenarioDropdownLabel"
                :buttons="scenarioDropdownButtons"
                :classes="['btn-sm', 'btn-outline']"
                align="end"
              />
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-base-content/60 font-medium">Budget:</span>
              <base-menu
                :text="budgetDropdownLabel"
                :buttons="budgetDropdownButtons"
                :classes="['btn-sm', 'btn-outline']"
                align="end"
              />
            </div>
          </div>
        </div>

        <!-- Tab 1: Amortization Schedule (Direct Table, No Pivot Tabs) -->
        <div
          v-if="activeView === 'amortization'"
          class="w-full flex-1 min-h-0 flex flex-col"
        >
          <data-table
            :title="amortizationTitle"
            :subtitle="amortizationSubtitle"
            :headers="state.amortizationTableHeaders"
            :rows="tableRows"
            :totals="tableFooter"
            :state-hash="state.stateHash"
            class="flex-1 min-h-0 flex flex-col"
          />
        </div>

        <!-- Tab 2: Dynamic Crosstab Comparative Analysis -->
        <div
          v-else-if="activeView === 'comparative'"
          class="w-full flex-1 min-h-0 flex flex-col"
        >
          <TabularAnalysis
            v-if="hasRefinancingScenarios"
            :title="`${state.getLoanName(currentLoan.id)} - Refinancing Comparison`"
            :subtitle="`Comparing refinancing scenarios for ${state.getLoanName(currentLoan.id)} (${budgetDropdownLabel})`"
            :analysis="refinancingComparativeAnalysis"
            :items="loanAndScenarios"
            :get-item-name="state.getLoanName"
            :baseline-id="activeScenario.id"
            :can-delete-item="canDeleteScenario"
            :state-hash="state.stateHash"
            class="flex-1 min-h-0 flex flex-col"
            @select-baseline="setSelectedScenarioId"
            @delete-item="handleDeleteScenario"
          />
          <TabularAnalysis
            v-else
            :title="`${state.getLoanName(activeScenario.id)} - Budget Comparison`"
            subtitle="Comparing how this loan performs across all repayment budgets"
            :analysis="loanComparativeAnalysis"
            :items="state.monthlyBudgets"
            :get-item-name="state.getBudgetName"
            :baseline-id="viewedItemId"
            :state-hash="state.stateHash"
            class="flex-1 min-h-0 flex flex-col"
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
