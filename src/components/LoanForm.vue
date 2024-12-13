<script setup>
import { computed, ref, watch } from 'vue';

import constants from '../constants/constants';
import useCoreStore from '../stores/core';

const coreState = useCoreStore();

const currentLoan = ref(null);

const principal = ref(0);
const interestRate = ref(0);
const termInYears = ref(0);
const name = ref('');
const currentBalance = ref(0);

const createButtonEnabled = computed(
  () => [principal.value, interestRate.value, termInYears.value].every(
    (input) => !Number.isNaN(input) && input > 0,
  ),
);

watch(
  () => coreState.currentLoanId,
  (newId) => {
    if (newId && coreState.loanFormActive) {
      currentLoan.value = coreState.getLoan(newId);
      principal.value = currentLoan.value.principal;
      interestRate.value = currentLoan.value.annualRate * 100;
      termInYears.value = currentLoan.value.termInYears;
      name.value = currentLoan.value.name;
      currentBalance.value = currentLoan.value.currentBalance;
    }
  },
  { immediate: true },
);

const clearForm = () => {
  principal.value = null;
  interestRate.value = null;
  termInYears.value = null;
  name.value = null;
  currentBalance.value = null;
};

const createLoan = () => {
  coreState.createLoan(
    principal.value,
    interestRate.value / 100,
    termInYears.value,
    name.value,
    currentBalance.value,
  );
  clearForm();
};

const exit = () => {
  clearForm();
  coreState.exitLoanForm();
};
</script>

<template>
  <base-modal :id="constants.LOAN_FORM_ID">
    <template #header>
      <h2>{{ coreState.loanFormTitle }}</h2>
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
          v-model.number="principal"
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
          <span :class="['label-text']">Current Balance (Optional)</span>
        </div>
        <input
          v-model.number="currentBalance"
          :class="['input input-bordered input-secondary w-full max-ws']"
          type="number"
          step="0.01"
          label="Current Balance"
        >
      </div>
    </template>
    <template #actions>
      <base-button
        :disabled="!createButtonEnabled"
        :class="'btn-success'"
        @click="createLoan"
      >
        {{ coreState.createLoanButtonText }}
      </base-button>
    </template>
  </base-modal>
</template>
