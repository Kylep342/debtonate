<script setup lang="ts">
import { contributionTypes, withdrawalTypes } from 'moneyfunx';
import { computed, ref, watch, ComputedRef, Ref } from 'vue';

import constants from '@/apps/appreciate/constants/constants';
import TabularAnalysis from '@/apps/shared/components/TabularAnalysis.vue';
import { useAppreciateCoreStore, AppreciateCoreStore } from '@/apps/appreciate/stores/core';
import { usePivot } from '@/apps/shared/composables/usePivot';
import { useBreakpoint } from '@/apps/shared/functions/viewport';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { Button } from '@/apps/shared/types/app';
import { MonthlyBudget } from '@/apps/shared/types/core';
import { UIInstrument } from '@/apps/appreciate/types/core';

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
const state: AppreciateCoreStore = useAppreciateCoreStore();
const { isMobile } = useBreakpoint();

const currentBudget: Ref<MonthlyBudget|null> = ref(null);

const { viewedItemId, setViewedItemId } = usePivot(constants.TOTALS);

const currentInstrument: ComputedRef<UIInstrument | null> = computed(() => {
  if (!viewedItemId.value) return null;
  return state.getInstrument(viewedItemId.value) || null;
});

const isCareerPhase = computed(() => state.viewPhase === constants.PHASE_CAREER);

const schedule: ComputedRef<contributionTypes.ContributionSchedule | withdrawalTypes.WithdrawalSchedule> = computed(() => {
  if (!currentBudget.value || !viewedItemId.value) {
    return {
      lifetimeGrowth: 0n,
      lifetimeContribution: 0n,
      amortizationSchedule: [],
    };
  }
  return isCareerPhase.value
    ? state.getContributionSchedule(viewedItemId.value, currentBudget.value.id)
    : state.getWithdrawalSchedule(viewedItemId.value, currentBudget.value.id);
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

const panelTitle = computed(() => {
  if (!currentBudget.value) return constants.BUDGET_DETAILS;
  const budgetName = isCareerPhase.value
    ? state.getBudgetName(currentBudget.value.id)
    : state.getWithdrawalBudgetName(currentBudget.value.id);
  return isCareerPhase.value
    ? `Budget Details - ${budgetName}`
    : `Withdrawal Details - ${budgetName}`;
});

const panelSubtitle = computed(() => {
  if (!currentBudget.value) return '';
  if (isCareerPhase.value) {
    return `${globalOptions.Money(currentBudget.value.absolute)}/month (+${globalOptions.Money(currentBudget.value.relative)}/month)`;
  }
  const diff = currentBudget.value.relative - state.desiredNetIncome;
  const diffStr = diff > 0
    ? `(+${globalOptions.Money(diff)}/mo vs target)`
    : diff < 0
      ? `(-${globalOptions.Money(Math.abs(diff))}/mo vs target)`
      : '(matches target)';
  return `${globalOptions.Money(currentBudget.value.absolute)}/month ${diffStr}`;
});

const activeView = ref<'amortization' | 'comparative'>('amortization');

const scheduleTabLabel = computed(() => (
  isMobile.value ? 'Schedule' : 'Amortization Schedule'
));

const comparativeTabLabel = computed(() => (
  isMobile.value ? 'Comparison' : 'Comparative Analysis'
));

const instrumentDropdownLabel = computed(() => (
  viewedItemId.value ? state.getInstrumentName(viewedItemId.value) : 'Select Instrument'
));

const instrumentDropdownButtons = computed<Button[]>(() =>
  state.instrumentsWithTotals.map((inst) => ({
    text: state.getInstrumentName(inst.id),
    onClick: () => setViewedItemId(inst.id),
  }))
);

const instrumentComparativeAnalysis = computed(() => {
  return state.getInstrumentComparativeAnalysis(
    viewedItemId.value || constants.TOTALS,
    isCareerPhase.value
  );
});

watch(
  () => state.currentBudgetId,
  (newId) => {
    if (newId && state.budgetDetailsPanelActive) {
      currentBudget.value = isCareerPhase.value
        ? state.getBudget(newId)!
        : state.getWithdrawalBudget(newId)!;
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
            <span class="text-base-content/60 text-[11px] block">
              {{ isCareerPhase ? 'Monthly Contribution' : 'Monthly Withdrawal' }}
            </span>
            <span class="font-mono font-bold text-sm sm:text-base text-base-content">
              {{ globalOptions.Money(currentBudget.absolute) }}/mo
            </span>
          </div>
          <div>
            <span class="text-base-content/60 text-[11px] block">
              {{ isCareerPhase ? 'Extra Relative Budget' : 'Target Net Income' }}
            </span>
            <span
              class="font-mono font-bold text-sm sm:text-base"
              :class="isCareerPhase ? 'text-primary' : 'text-base-content'"
            >
              {{ isCareerPhase ? `+${globalOptions.Money(currentBudget.relative)}/mo` : `${globalOptions.Money(state.desiredNetIncome)}/mo` }}
            </span>
          </div>
          <div class="col-span-2 sm:col-span-1 flex items-center justify-between sm:block border-t border-base-content/10 pt-2.5 sm:border-t-0 sm:pt-0">
            <span class="text-base-content/60 text-[11px] block whitespace-nowrap">Planning Phase</span>
            <span class="badge badge-sm badge-primary uppercase text-[10px] mt-0 sm:mt-0.5 whitespace-nowrap tracking-wider font-semibold">
              {{ isCareerPhase ? 'Career Accumulation' : 'Retirement Drawdown' }}
            </span>
          </div>
        </div>

        <!-- Paired Navigation Tabs & Instrument Dropdown -->
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
            <span class="text-xs text-base-content/60 font-medium">Instrument:</span>
            <base-menu
              :text="instrumentDropdownLabel"
              :buttons="instrumentDropdownButtons"
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
            :title="`${state.getInstrumentName(viewedItemId || constants.TOTALS)} - Budget Comparison`"
            :subtitle="`Comparing all ${isCareerPhase ? 'career budgets' : 'withdrawal budgets'} for ${state.getInstrumentName(viewedItemId || constants.TOTALS)}`"
            :analysis="instrumentComparativeAnalysis"
            :items="isCareerPhase ? state.monthlyBudgets : state.monthlyWithdrawalBudgets"
            :get-item-name="isCareerPhase ? state.getBudgetName : state.getWithdrawalBudgetName"
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
