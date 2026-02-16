<script setup lang="ts">
import moneyfunx from 'moneyfunx';
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

const isCareerPhase = computed(() => state.viewPhase === constants.PHASE_CAREER);

const schedule: ComputedRef<moneyfunx.ContributionSchedule | moneyfunx.WithdrawalSchedule> = computed(() => {
  if (!currentBudget.value || !viewedItemId.value) return <moneyfunx.ContributionSchedule>{};
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

  return `Budget Details - ${budgetName} | `
    + `${globalOptions.Money(monthlyBudget.absolute)}/month `
    + (isCareerPhase.value ? `(+${globalOptions.Money(monthlyBudget.relative)}/month)` : '');
}

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
