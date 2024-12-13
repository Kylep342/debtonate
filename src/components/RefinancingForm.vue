<script setup>
import { computed, ref, watch } from 'vue';

import constants from '../constants/constants';
import useCoreStore from '../stores/core';
import useRefinancingStore from '../stores/refinancing';

const coreState = useCoreStore();
const refi = useRefinancingStore();

const currentLoan = ref(coreState.getLoan(coreState.currentLoanId));

const currentBalance = ref(currentLoan.value?.currentBalance || 0);
const interestRate = ref((currentLoan.value?.annualRate || 0) * 100);
const termInYears = ref(currentLoan.value?.termInYears || 0);
const name = ref(currentLoan.value?.name || '');
const fees = ref(0);

const createButtonEnabled = computed(
  () => [currentBalance.value, interestRate.value, termInYears.value].every(
    (input) => !Number.isNaN(input) && input > 0,
  ),
);

watch(
  () => coreState.currentLoanId,
  (newId) => {
    if (newId && refi.refinancingFormActive.value) {
      currentLoan.value = coreState.getLoan(newId);
      currentBalance.value = currentLoan.value.currentBalance;
      interestRate.value = currentLoan.value.annualRate * 100;
      termInYears.value = currentLoan.value.termInYears;
      name.value = currentLoan.value.name;
      
    }
  },
  { immediate: true },
);

const clearCreate = () => {
  currentBalance.value = null;
  interestRate.value = null;
  termInYears.value = null;
  name.value = null;
  fees.value = null;
};

const refinanceLoan = () => {
  refi.addScenario(
    '12334',
    currentBalance.value,
    interestRate.value,
    termInYears.value,
    fees.value
  );
  // clearCreate();
};

const exit = () => {
  clearCreate();
  refi.exitRefinancingForm();
};
</script>

<template>
  <base-modal :id="constants.REFINANCE_FORM_ID">
    <template #header>
      <h2>{{ refi.refinancingFormTitle }}</h2>
    </template>
    <template #headerActions>
      <base-button
        :class="['btn btn-circle btn-ghost']"
        @click="exit"
      >
        x
      </base-button>
    </template>
    <template #body>
      <div :class="['formInputs']">
        <div :class="['label']">
          <span :class="['label-text']">Principal</span>
        </div>
        <input
          v-model.number="currentBalance"
          :class="['input input-bordered input-secondary w-full max-ws']"
          type="number"
          step="0.01"
          label="Principal"
        >
        <div :class="['label']">
          <span :class="['label-text']">Interest Rate</span>
        </div>
        <input
          v-model.number="interestRate"
          :class="['input input-bordered input-secondary w-full max-ws']"
          type="number"
          step="0.01"
          label="Interest Rate"
        >
        <div :class="['label']">
          <span :class="['label-text']">Term (In Years)</span>
        </div>
        <input
          v-model.number="termInYears"
          :class="['input input-bordered input-secondary w-full max-ws']"
          type="number"
          label="Term In Years"
        >
        <div :class="['label']">
          <span :class="['label-text']">Fees (Optional)</span>
        </div>
        <input
          v-model.number="fees"
          :class="['input input-bordered input-secondary w-full max-ws']"
          type="number"
          step="0.01"
          label="Fees"
        >
      </div>
    </template>
    <template #actions>
      <base-button
        :disabled="!createButtonEnabled"
        :class="'btn-success'"
        @click="refinanceLoan"
      >
        {{ constants.BTN_REFINANCE }}
      </base-button>
    </template>
  </base-modal>
</template>
