<script setup lang="ts">
import { contributionTypes, withdrawalTypes } from 'moneyfunx';
import { computed, ref, watch, ComputedRef, Ref } from 'vue';

import constants from '@/apps/appreciate/constants/constants';
import { useAppreciateCoreStore, AppreciateCoreStore } from '@/apps/appreciate/stores/core';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { usePivot } from '@/apps/shared/composables/usePivot';
import { Budget } from '@/apps/shared/types/core';
import { UIInstrument } from '@/apps/appreciate/types/core';

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
const state: AppreciateCoreStore = useAppreciateCoreStore();

const currentInstrument: Ref<UIInstrument|null> = ref(null);

const { viewedItemId, isViewedItemId, setViewedItemId } = usePivot(constants.DEFAULT);

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

const buildInstrumentDetailsTitle = (inst: UIInstrument | null): string => inst
  ? `Instrument Details - ${state.getInstrumentName(inst.id)} | `
    + `${state.buildInstrumentSubtitle(inst)}`
  : constants.INSTRUMENT_DETAILS;

const title: ComputedRef<string> = computed(() => buildInstrumentDetailsTitle(currentInstrument.value));

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
      <div class="flex items-center gap-2 pl-2">
        <h2 class="text-lg md:text-xl font-bold tracking-tight text-base-content">
          {{ title }}
        </h2>
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
            <span class="badge badge-sm badge-primary uppercase text-[10px] mt-0.5">
              {{ isCareerPhase ? 'Accumulation' : 'Retirement' }}
            </span>
          </div>
        </div>

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
          @click="state.unviewInstrument"
        >
          Done
        </base-button>
      </div>
    </template>
  </base-modal>
</template>
