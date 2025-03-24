<script setup lang="ts">
import { IInstrument } from 'moneyfunx';
import { computed, ref, watch } from 'vue';

// import AmortizationTable from '@/apps/debtonate/components/AmortizationTable.vue';
import { usePivot } from '@/apps/shared/composables/usePivot';
import constants from '@/apps/appreciate/constants/constants';
import shared_constants from '@/apps/shared/constants/constants';
import useAppreciateCoreStore from '@/apps/appreciate/stores/core';

const state = useAppreciateCoreStore();

const currentInstrument = ref<IInstrument>();

const { viewedItemId, isViewedItemId, setViewedItemId } = usePivot(shared_constants.DEFAULT);

const buildInstrumentDetailsTitle = (instrument: IInstrument): string => instrument
  ? `Instrument Details - ${state.getInstrumentName(instrument.id)} | `
    + `${state.buildInstrumentSubtitle(instrument)}`
  : constants.LOAN_DETAILS;

const title = computed<string>(() => buildInstrumentDetailsTitle(currentInstrument.value!));

watch(
  () => state.currentInstrumentId,
  (newId) => {
    if (newId && state.instrumentDetailsPanelActive) {
      currentInstrument.value = state.getInstrument(newId);
    }
  },
  { immediate: true },
);
</script>

<template>
  <base-modal :id="constants.INSTRUMENT_DETAILS_ID" @exit="state.unviewInstrument">
    <template #header>
      <h2>{{ title }}</h2>
    </template>
    <template #headerActions>
      <base-button :class="['btn btn-circle btn-ghost']" @click="state.unviewInstrument">
        x
      </base-button>
    </template>
    <template #body>
      <div v-if="currentInstrument" :class="['tabframe', 'w-auto']">
        <base-tabs :get-item-name="state.getBudgetName" :pivot="state.monthlyBudgets"
          :is-viewed-item-id="isViewedItemId" :set-viewed-item-id="setViewedItemId">
          <template #tabContent>
            <h2>{{ state.getBudgetName(viewedItemId) }}</h2>
            <!-- <AmortizationTable :payment-schedule="state.getPaymentSchedule(currentInstrument.id, viewedItemId)" :title="state.buildAmortizationTableTitle(
              currentInstrument,
              state.getBudget(viewedItemId),
            )" :subtitle="state.buildAmortizationTableSubtitle(
                currentInstrument,
                state.getBudget(viewedItemId),
              )" /> -->
          </template>
        </base-tabs>
      </div>
    </template>
  </base-modal>
</template>
