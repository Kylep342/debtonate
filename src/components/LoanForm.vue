<script setup>
import { computed, ref, watch } from 'vue';

import constants from '../constants/constants';
import useCoreStore from '../stores/core';

const state = useCoreStore();

const currentLoan = ref(state.getLoan(state.currentLoanId));

const principal = ref(currentLoan.value?.principal || 0);
const interestRate = ref((currentLoan.value?.annualRate || 0) * 100);
const termInYears = ref(currentLoan.value?.termInYears || 0);
const name = ref(currentLoan.value?.name || '');
const currentBalance = ref(currentLoan.value?.currentBalance || null);

const createButtonEnabled = computed(
  () => [principal.value, interestRate.value, termInYears.value].every(
    (input) => !Number.isNaN(input) && input > 0,
  ),
);

watch(
  () => state.currentLoanId,
  (newId) => {
    if (newId) {
      currentLoan.value = state.getLoan(newId);
      principal.value = currentLoan.value.principal;
      interestRate.value = currentLoan.value.annualRate * 100;
      termInYears.value = currentLoan.value.termInYears;
      name.value = currentLoan.value.name;
      currentBalance.value = currentLoan.value.currentBalance;
    }
  },
  { immediate: true },
);

const clearCreate = () => {
  principal.value = null;
  interestRate.value = null;
  termInYears.value = null;
  name.value = null;
  currentBalance.value = null;
};

const createLoan = () => {
  state.createLoan(
    principal.value,
    interestRate.value / 100,
    termInYears.value,
    name.value,
    currentBalance.value,
  );
  clearCreate();
};

const exit = () => {
  clearCreate();
  state.exitCreateLoanForm();
};
</script>

<template>
  <base-modal :id="constants.LOAN_FORM_ID">
    <template #header>
      <h2>{{ state.createLoanFormTitle }}</h2>
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
          <span :class="['label-text']">Current Balanec (Optional)</span>
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
        {{ state.createLoanButtonText }}
      </base-button>
    </template>
  </base-modal>
</template>
