<script setup lang="ts">
import * as moneyfunx from 'moneyfunx';
import { computed, ref, watch, ComputedRef, Ref } from 'vue';

import constants from '@/apps/appreciate/constants/constants';
import { useAppreciateCoreStore, AppreciateCoreStore } from '@/apps/appreciate/stores/core';
import { usePivot } from '@/apps/shared/composables/usePivot';
import { Budget } from '@/apps/shared/types/core';

const state: AppreciateCoreStore = useAppreciateCoreStore();

const currentInstrument: Ref<moneyfunx.IInstrument|null> = ref(null);

const { viewedItemId, isViewedItemId, setViewedItemId } = usePivot(constants.DEFAULT);

const currentBudget: ComputedRef<Budget|null> = computed(() => {
  if (!viewedItemId.value) return null;
  return state.getBudget(viewedItemId.value)!;
});

const contributionSchedule: ComputedRef<moneyfunx.ContributionSchedule> = computed(() => {
  if (!currentInstrument.value || !viewedItemId.value) return <moneyfunx.ContributionSchedule>{};
  return state.getContributionSchedule(currentInstrument.value.id, viewedItemId.value)
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
  return state.amortizationTableRows(contributionSchedule.value)
});

const tableFooter: ComputedRef<{}> = computed(() => {
  if (!contributionSchedule.value) return [];
  return state.amortizationTableTotals(contributionSchedule.value)
});

const buildInstrumentDetailsTitle = (instrument: moneyfunx.IInstrument): string => instrument
  ? `Instrument Details - ${state.getInstrumentName(instrument.id)} | `
    + `${state.buildInstrumentSubtitle(instrument)}`
  : constants.INSTRUMENT_DETAILS;

const title: ComputedRef<string> = computed(() => buildInstrumentDetailsTitle(currentInstrument.value!));

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
  <base-modal :id="constants.INSTRUMENT_DETAILS_ID" @exit="state.unviewInstrument">
    <template #header>
      <h2 :class="['pl-4']">{{ title }}</h2>
    </template>
    <template #headerActions>
      <base-button :class="['btn btn-circle btn-ghost']" @click="state.unviewInstrument">
        x
      </base-button>
    </template>
    <template #body>
      <div v-if="currentInstrument" :class="['tabframe', 'w-auto']">
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
    </template>
  </base-modal>
</template>
