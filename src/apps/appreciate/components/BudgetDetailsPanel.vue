<script setup lang="ts">
import * as moneyfunx from 'moneyfunx';
import { computed, ref, watch, ComputedRef, Ref } from 'vue';

import constants from '@/apps/appreciate/constants/constants';
import { useAppreciateCoreStore, AppreciateCoreStore } from '@/apps/appreciate/stores/core';
import { usePivot } from '@/apps/shared/composables/usePivot';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { MonthlyBudget } from '@/apps/shared/types/core';

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
const state: AppreciateCoreStore = useAppreciateCoreStore();

const currentBudget: Ref<MonthlyBudget|null> = ref(null);

const { viewedItemId, isViewedItemId, setViewedItemId } = usePivot(constants.TOTALS);

const currentInstrument: ComputedRef<moneyfunx.IInstrument|null> = computed(() => {
  if (!viewedItemId.value) return null;
  return state.getInstrument(viewedItemId.value)!;
});

const contributionSchedule: ComputedRef<moneyfunx.ContributionSchedule> = computed(() => {
  if (!currentBudget.value || !viewedItemId.value) return <moneyfunx.ContributionSchedule>{};
  return state.getContributionSchedule(viewedItemId.value, currentBudget.value.id)
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
  if (!contributionSchedule.value) return [];
  return state.amortizationTableRows(contributionSchedule.value);
});

const tableFooter: ComputedRef<{}> = computed(() => {
  if (!contributionSchedule.value) return {};
  return state.amortizationTableTotals(contributionSchedule.value);
});

const buildBudgetDetailsTitle = (monthlyBudget: MonthlyBudget): string => monthlyBudget
  ? `Budget Details - ${state.getBudgetName(monthlyBudget.id)} | `
  + `${globalOptions.Money(monthlyBudget.absolute)}/month `
  + `(+${globalOptions.Money(monthlyBudget.relative)}/month)`
  : constants.BUDGET_DETAILS;

const title: ComputedRef<string> = computed(() => (buildBudgetDetailsTitle(currentBudget.value!)))

watch(
  () => state.currentBudgetId,
  (newId) => {
    if (newId && state.budgetDetailsPanelActive) {
      currentBudget.value = state.getBudget(newId);
    }
  },
  { immediate: true },
);
</script>

<template>
  <base-modal :id="constants.BUDGET_DETAILS_ID" @exit="state.unviewBudget">
    <template #header>
      <h2 :class="['pl-4']">{{ title }}</h2>
    </template>
    <template #headerActions>
      <base-button :class="['btn btn-circle btn-ghost']" @click="state.unviewBudget">
        x
      </base-button>
    </template>
    <template #body>
      <div v-if="currentBudget" :class="['tabframe', 'w-auto']">
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
    </template>
  </base-modal>
</template>
