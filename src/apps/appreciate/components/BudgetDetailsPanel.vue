<script setup lang="ts">
import { contributionTypes, withdrawalTypes } from 'moneyfunx';
import { computed, ref, watch, ComputedRef, Ref } from 'vue';

import constants from '@/apps/appreciate/constants/constants';
import { useAppreciateCoreStore, AppreciateCoreStore } from '@/apps/appreciate/stores/core';
import { usePivot } from '@/apps/shared/composables/usePivot';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { MonthlyBudget } from '@/apps/shared/types/core';
import { UIInstrument } from '@/apps/appreciate/types/core';

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
const state: AppreciateCoreStore = useAppreciateCoreStore();

const currentBudget: Ref<MonthlyBudget|null> = ref(null);

const { viewedItemId, isViewedItemId, setViewedItemId } = usePivot(constants.TOTALS);

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

const buildBudgetDetailsTitle = (monthlyBudget: MonthlyBudget | null): string => {
  if (!monthlyBudget) return constants.BUDGET_DETAILS;

  const budgetName = isCareerPhase.value
    ? state.getBudgetName(monthlyBudget.id)
    : state.getWithdrawalBudgetName(monthlyBudget.id);

  if (isCareerPhase.value) {
    return `Budget Details - ${budgetName} | `
      + `${globalOptions.Money(monthlyBudget.absolute)}/month `
      + `(+${globalOptions.Money(monthlyBudget.relative)}/month)`;
  }
  const diff = monthlyBudget.relative - state.desiredNetIncome;
  const diffStr = diff > 0
    ? `(+${globalOptions.Money(diff)}/mo vs target)`
    : diff < 0
      ? `(-${globalOptions.Money(Math.abs(diff))}/mo vs target)`
      : '(matches target)';
  return `Withdrawal Details - ${budgetName} | `
    + `${globalOptions.Money(monthlyBudget.absolute)}/month `
    + diffStr;
};

const title: ComputedRef<string> = computed(() => (buildBudgetDetailsTitle(currentBudget.value)))

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
      <div class="flex items-center gap-2 pl-2">
        <h2 class="text-lg md:text-xl font-bold tracking-tight text-base-content">
          {{ title }}
        </h2>
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
          <div>
            <span class="text-base-content/60 text-[11px] block">Target Planning Phase</span>
            <span class="badge badge-sm badge-primary uppercase text-[10px] mt-0.5">
              {{ isCareerPhase ? 'Career Accumulation' : 'Retirement Drawdown' }}
            </span>
          </div>
        </div>

        <!-- Amortization Schedules Pivot -->
        <div class="tabframe w-auto">
          <base-tabs
            :get-item-name="state.getInstrumentName"
            :pivot="state.instrumentsWithTotals"
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
          @click="state.unviewBudget"
        >
          Done
        </base-button>
      </div>
    </template>
  </base-modal>
</template>
