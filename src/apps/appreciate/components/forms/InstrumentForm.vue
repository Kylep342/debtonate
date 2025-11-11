<script setup lang="ts">
import { computed, ref, watch, type ComputedRef, type Ref } from 'vue';

import constants from '@/apps/appreciate/constants/constants';
import { useAppreciateCoreStore, type AppreciateCoreStore } from '@/apps/appreciate/stores/core';

const state: AppreciateCoreStore = useAppreciateCoreStore();

const annualLimit: Ref<number | null> = ref(null);
const currentBalance: Ref<number | null> = ref(null);
const interestRate: Ref<number | null> = ref(null);
const name: Ref<string | null> = ref(null);

const createButtonEnabled: ComputedRef<boolean> = computed(
  () => [currentBalance.value, interestRate.value].every(
    (input) => !Number.isNaN(input) && input !== null && input > 0,
  ),
);

const createInstrumentButtonText: ComputedRef<string> = computed(() => (
  state.currentInstrumentId
    ? constants.BTN_SAVE
    : constants.BTN_CREATE
));

watch(
  () => state.currentInstrumentId,
  (newId: string) => {
    if (newId && state.instrumentFormActive) {
      const currentInstrument = state.getInstrument(newId);
      annualLimit.value = currentInstrument.annualLimit;
      currentBalance.value = currentInstrument.currentBalance;
      interestRate.value = currentInstrument.annualRate * 100;
      name.value = currentInstrument.name;
    }
  },
  { immediate: true },
);

const clearForm = () => {
  annualLimit.value = null;
  currentBalance.value = null;
  interestRate.value = null;
  name.value = null;
};

const exit = () => {
  clearForm();
  state.exitInstrumentForm();
};

const createInstrument = () => {
  state.createInstrument(
    currentBalance.value,
    interestRate.value! / 100,
    name.value,
    annualLimit.value
  );
  exit();
};
</script>

<template>
  <base-modal @exit="exit">
    <template #header>
      <h2 :class="['pl-4']">
        {{ state.instrumentFormTitle }}
      </h2>
    </template>
    <template #headerActions>
      <base-button :class="['btn btn-circle btn-ghost']" @click="exit">
        x
      </base-button>
    </template>
    <template #body>
      <div :class="['formInputs']">
        <div :class="['label']">
          <span :class="['label-text']">Current Balance</span>
        </div>
        <input :id="`${constants.INSTRUMENT_FORM_ID}-current-balance`" v-model.number="currentBalance"
          :class="['input input-bordered input-secondary w-full max-ws']" type="number" step="0.01"
          label="Current Balance">
        <div :class="['label']">
          <span :class="['label-text']">Interest Rate</span>
        </div>
        <input :id="`${constants.INSTRUMENT_FORM_ID}-interest-rate`" v-model.number="interestRate"
          :class="['input input-bordered input-secondary w-full max-ws']" type="number" step="0.01"
          label="Interest Rate">
        <div :class="['label']">
          <span :class="['label-text']">Name (Optional)</span>
        </div>
        <input :id="`${constants.INSTRUMENT_FORM_ID}-name`" v-model="name"
          :class="['input input-bordered input-secondary w-full max-ws']" type="string" label="Name">
        <div :class="['label']">
          <span :class="['label-text']">Annual Limit (Optional)</span>
        </div>
        <input :id="`${constants.INSTRUMENT_FORM_ID}-annual-limit`" v-model.number="annualLimit"
          :class="['input input-bordered input-secondary w-full max-ws']" type="number" step="0.01" label="Annual Limit">
      </div>
    </template>
    <template #actions>
      <base-button :disabled="!createButtonEnabled" :class="'btn-success'" @click="createInstrument">
        {{ createInstrumentButtonText }}
      </base-button>
    </template>
  </base-modal>
</template>
