<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import constants from '@@constants/constants';
import useCoreStore from '@@stores/core';

const coreState = useCoreStore();

const loanId = ref<string|null>(null);
const currentBalance = ref<number|null>(null);
const interestRate = ref<number|null>(null);
const termInYears = ref<number|null>(null);
const name = ref<string|null>(null);
const fees = ref<number|null>(null);

const createButtonEnabled = computed<boolean>(
  () => [currentBalance.value, interestRate.value, termInYears.value].every(
    (input) => !Number.isNaN(input) && input > 0,
  ),
);

watch(
  () => coreState.currentLoanId,
  (newId) => {
    if (newId && coreState.refinancingFormActive) {
      loanId.value = newId;
      const currentLoan = coreState.getLoan(loanId.value);
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

const refinanceLoan = () => {
  coreState.createRefinanceScenario(
    loanId.value,
    currentBalance.value,
    interestRate.value! / 100,
    termInYears.value,
    name.value,
    fees.value,
  );
  clearForm();
};

const exit = () => {
  clearForm();
  coreState.exitRefinancingForm();
};
</script>

<template>
  <base-modal
    :id="constants.REFINANCING_FORM_ID"
    @exit="exit"
  >
    <template #header>
      <h2>{{ coreState.refinancingFormTitle }}</h2>
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
          <span :class="['label-text']">Name (Optional)</span>
        </div>
        <input
          v-model="name"
          :class="['input input-bordered input-secondary w-full max-ws']"
          type="string"
          label="Name"
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
