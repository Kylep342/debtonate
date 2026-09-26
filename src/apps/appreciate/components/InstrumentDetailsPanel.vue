<script setup lang="ts">
import { contributionTypes, withdrawalTypes } from 'moneyfunx';
import { computed, ref, watch, ComputedRef, Ref } from 'vue';

import constants from '@/apps/appreciate/constants/constants';
import TabularAnalysis from '@/apps/shared/components/TabularAnalysis.vue';
import { useAppreciateCoreStore, AppreciateCoreStore } from '@/apps/appreciate/stores/core';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { usePivot } from '@/apps/shared/composables/usePivot';
import { useBreakpoint } from '@/apps/shared/functions/viewport';
import { Button } from '@/apps/shared/types/app';
import { Budget } from '@/apps/shared/types/core';
import { UIInstrument } from '@/apps/appreciate/types/core';

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
const state: AppreciateCoreStore = useAppreciateCoreStore();
const { isMobile } = useBreakpoint();

const currentInstrument: Ref<UIInstrument|null> = ref(null);

const { viewedItemId, setViewedItemId } = usePivot(constants.DEFAULT);

const isCareerPhase = computed(() => state.viewPhase === constants.PHASE_CAREER);

const currentBudget: ComputedRef<Budget|null> = computed(() => {
  if (!viewedItemId.value) return null;
  return isCareerPhase.value
    ? state.getBudget(viewedItemId.value)!
    : state.getWithdrawalBudget(viewedItemId.value)!;
});

const schedule: ComputedRef<contributionTypes.ContributionSchedule | withdrawalTypes.WithdrawalSchedule> = computed(() => {
  if (!currentInstrument.value || !viewedItemId.value) {
    return {
      lifetimeGrowth: 0n,
      lifetimeContribution: 0n,
      amortizationSchedule: [],
    };
  }
  return isCareerPhase.value
    ? state.getContributionSchedule(currentInstrument.value.id, viewedItemId.value)
    : state.getWithdrawalSchedule(currentInstrument.value.id, viewedItemId.value);
});

const amortizationTitle: ComputedRef<string> = computed(() => {
  if (!currentInstrument.value || !currentBudget.value) return '';
  return state.buildAmortizationTableTitle(currentInstrument.value, currentBudget.value);
});

const amortizationSubtitle: ComputedRef<string> = computed(() => {
  if (!currentInstrument.value || !currentBudget.value) return '';
  return state.buildAmortizationTableSubtitle(currentInstrument.value, currentBudget.value);
});

const tableRows: ComputedRef<{}[]> = computed(() => {
  if (!schedule.value) return [];
  return state.amortizationTableRows(schedule.value);
});

const tableFooter: ComputedRef<{}> = computed(() => {
  if (!schedule.value) return {};
  return state.amortizationTableTotals(schedule.value);
});

const panelTitle = computed(() => (
  currentInstrument.value
    ? `Instrument Details - ${state.getInstrumentName(currentInstrument.value.id)}`
    : constants.INSTRUMENT_DETAILS
));

const panelSubtitle = computed(() => (
  currentInstrument.value ? state.buildInstrumentSubtitle(currentInstrument.value) : ''
));

const activeView = ref<'amortization' | 'comparative'>('amortization');

const scheduleTabLabel = computed(() => (
  isMobile.value ? 'Schedule' : 'Amortization Schedule'
));

const comparativeTabLabel = computed(() => (
  isMobile.value ? 'Comparison' : 'Comparative Analysis'
));

const budgetDropdownLabel = computed(() => {
  if (!viewedItemId.value) return 'Select Budget';
  return isCareerPhase.value
    ? state.getBudgetName(viewedItemId.value)
    : state.getWithdrawalBudgetName(viewedItemId.value);
});

const budgetDropdownButtons = computed<Button[]>(() => {
  const budgets = isCareerPhase.value ? state.monthlyBudgets : state.monthlyWithdrawalBudgets;
  const getName = isCareerPhase.value ? state.getBudgetName : state.getWithdrawalBudgetName;
  return budgets.map((budget) => ({
    text: getName(budget.id),
    onClick: () => setViewedItemId(budget.id),
  }));
});

const instrumentComparativeAnalysis = computed(() => {
  if (!currentInstrument.value) return {};
  return state.getInstrumentComparativeAnalysis(currentInstrument.value.id, isCareerPhase.value);
});

watch(
  () => state.currentInstrumentId,
  (newId) => {
    if (newId && state.instrumentDetailsPanelActive) {
      currentInstrument.value = state.getInstrument(newId) || null;
    }
  },
  { immediate: true },
);
</script>

<template>
  <base-modal
    :id="constants.INSTRUMENT_DETAILS_ID"
    :max-width="'4xl'"
    @exit="state.unviewInstrument"
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
        @click="state.unviewInstrument"
      >
        x
      </base-button>
    </template>
    <template #body>
      <div
        v-if="currentInstrument"
        class="p-3 sm:p-4 flex flex-col gap-4"
      >
        <!-- Top Stat Ribbon -->
        <div class="bg-base-200/50 rounded-xl p-3.5 border border-base-content/10 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span class="text-base-content/60 text-[11px] block">Current Balance</span>
            <span class="font-mono font-bold text-sm sm:text-base text-base-content">
              {{ globalOptions.Money(currentInstrument.currentBalance) }}
            </span>
          </div>
          <div>
            <span class="text-base-content/60 text-[11px] block">Expected Return</span>
            <span class="font-mono font-bold text-sm sm:text-base text-primary">
              {{ (currentInstrument.annualRate * 100).toFixed(2) }}%
            </span>
          </div>
          <div>
            <span class="text-base-content/60 text-[11px] block">Annual Limit</span>
            <span class="font-mono font-bold text-sm sm:text-base text-base-content">
              {{ currentInstrument.annualLimit ? globalOptions.Money(currentInstrument.annualLimit) : 'No Limit' }}
            </span>
          </div>
          <div>
            <span class="text-base-content/60 text-[11px] block">Current Phase</span>
            <span class="badge badge-sm badge-primary uppercase text-[10px] mt-0.5 whitespace-nowrap tracking-wider font-semibold">
              {{ isCareerPhase ? 'Accumulation' : 'Retirement' }}
            </span>
          </div>
        </div>

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
            :title="`${state.getInstrumentName(currentInstrument.id)} - Budget Comparison`"
            :subtitle="isCareerPhase ? 'Comparing contributions and growth across career budgets' : 'Comparing retirement drawdowns across withdrawal budgets'"
            :analysis="instrumentComparativeAnalysis"
            :items="isCareerPhase ? state.monthlyBudgets : state.monthlyWithdrawalBudgets"
            :get-item-name="isCareerPhase ? state.getBudgetName : state.getWithdrawalBudgetName"
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
          @click="state.unviewInstrument"
        >
          Done
        </base-button>
      </div>
    </template>
  </base-modal>
</template>
