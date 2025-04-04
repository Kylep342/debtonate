<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import constants from '@/apps/debtonate/constants/constants';
import useDebtonateCoreStore from '@/apps/debtonate/stores/core';

const state = useDebtonateCoreStore();

const loanId = ref<string | null>(null);
const currentBalance = ref<number | null>(null);
const interestRate = ref<number | null>(null);
const termInYears = ref<number | null>(null);
const name = ref<string | null>(null);
const fees = ref<number | null>(null);

const createButtonEnabled = computed<boolean>(
  () => [currentBalance.value, interestRate.value, termInYears.value].every(
    (input) => !Number.isNaN(input) && input > 0,
  ),
);

watch(
  () => state.currentLoanId,
  (newId) => {
    if (newId && state.refinancingFormActive) {
      loanId.value = newId;
      const currentLoan = state.getLoan(loanId.value);
      currentBalance.value = currentLoan.currentBalance;
    }
  },
  { immediate: true },
);

const clearForm = () => {
  currentBalance.value = null;
  interestRate.value = null;
  termInYears.value = null;
  name.value = null;
  fees.value = null;
};

const exit = () => {
  clearForm();
  state.exitRefinancingForm();
};

const refinanceLoan = () => {
  state.createRefinanceScenario(
    loanId.value,
    currentBalance.value,
    interestRate.value! / 100,
    termInYears.value,
    name.value,
    fees.value,
  );
  exit();
};
</script>

<template>
  <base-modal @exit="exit">
    <template #header>
      <h2>{{ state.refinancingFormTitle }}</h2>
    </template>
    <template #headerActions>
      <base-button :class="['btn btn-circle btn-ghost']" @click="exit">
        x
      </base-button>
    </template>
    <template #body>
      <div :class="['formInputs']">
        <div :class="['label']">
          <span :class="['label-text']">Principal</span>
        </div>
        <input :id="`${constants.REFINANCING_FORM_ID}-current-balance`" v-model.number="currentBalance"
          :class="['input input-bordered input-secondary w-full max-ws']" type="number" step="0.01" label="Principal">
        <div :class="['label']">
          <span :class="['label-text']">Interest Rate</span>
        </div>
        <input :id="`${constants.REFINANCING_FORM_ID}-interest-rate`" v-model.number="interestRate"
          :class="['input input-bordered input-secondary w-full max-ws']" type="number" step="0.01"
          label="Interest Rate">
        <div :class="['label']">
          <span :class="['label-text']">Term (In Years)</span>
        </div>
        <input :id="`${constants.REFINANCING_FORM_ID}-term-in-years`" v-model.number="termInYears"
          :class="['input input-bordered input-secondary w-full max-ws']" type="number" label="Term In Years">
        <div :class="['label']">
          <span :class="['label-text']">Name (Optional)</span>
        </div>
        <input :id="`${constants.REFINANCING_FORM_ID}-name`" v-model="name"
          :class="['input input-bordered input-secondary w-full max-ws']" type="string" label="Name">
        <div :class="['label']">
          <span :class="['label-text']">Fees (Optional)</span>
        </div>
        <input :id="`${constants.REFINANCING_FORM_ID}-fees`" v-model.number="fees"
          :class="['input input-bordered input-secondary w-full max-ws']" type="number" step="0.01" label="Fees">
      </div>
    </template>
    <template #actions>
      <base-button :disabled="!createButtonEnabled" :class="'btn-success'" @click="refinanceLoan">
        {{ constants.BTN_REFINANCE }}
      </base-button>
    </template>
  </base-modal>
</template>
