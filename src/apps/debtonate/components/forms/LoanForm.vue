<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import constants from '../../constants/constants';
import useDebtonateCoreStore from '@/apps/debtonate/stores/core';

const state = useDebtonateCoreStore();

const principal = ref<number | null>(null);
const interestRate = ref<number | null>(null);
const termInYears = ref<number | null>(null);
const name = ref<string | null>(null);
const currentBalance = ref<number | null>(null);
const fees = ref<number | null>(null);

const createButtonEnabled = computed<boolean>(
  () => [principal.value, interestRate.value, termInYears.value].every(
    (input) => !Number.isNaN(input) && input > 0,
  ),
);

const createLoanButtonText = computed<string>(() => (
  state.currentLoanId
    ? constants.BTN_SAVE
    : constants.BTN_CREATE
));

watch(
  () => state.currentLoanId,
  (newId) => {
    if (newId && state.loanFormActive) {
      const currentLoan = state.getLoan(newId);
      principal.value = currentLoan.principal;
      interestRate.value = currentLoan.annualRate * 100;
      termInYears.value = currentLoan.termInYears;
      name.value = currentLoan.name;
      currentBalance.value = currentLoan.currentBalance;
      fees.value = currentLoan.fees;
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
  fees.value = null;
};

const exit = () => {
  clearForm();
  state.exitLoanForm();
};

const createLoan = () => {
  state.createLoan(
    principal.value,
    interestRate.value! / 100,
    termInYears.value,
    name.value,
    currentBalance.value,
    fees.value,
  );
  exit();
};
</script>

<template>
  <base-modal @exit="exit">
    <template #header>
      <h2 :class="['pl-4']">
        {{ state.loanFormTitle }}
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
          <span :class="['label-text']">Principal</span>
        </div>
        <input :id="`${constants.LOAN_FORM_ID}-principal`" v-model.number="principal"
          :class="['input input-bordered input-secondary w-full max-ws']" type="number" step="0.01" label="Principal">
        <div :class="['label']">
          <span :class="['label-text']">Interest Rate</span>
        </div>
        <input :id="`${constants.LOAN_FORM_ID}-interest-rate`" v-model.number="interestRate"
          :class="['input input-bordered input-secondary w-full max-ws']" type="number" step="0.01"
          label="Interest Rate">
        <div :class="['label']">
          <span :class="['label-text']">Term (In Years)</span>
        </div>
        <input :id="`${constants.LOAN_FORM_ID}-term-in-years`" v-model.number="termInYears"
          :class="['input input-bordered input-secondary w-full max-ws']" type="number" label="Term In Years">
        <div :class="['label']">
          <span :class="['label-text']">Name (Optional)</span>
        </div>
        <input :id="`${constants.LOAN_FORM_ID}-name`" v-model="name"
          :class="['input input-bordered input-secondary w-full max-ws']" type="string" label="Name">
        <div :class="['label']">
          <span :class="['label-text']">Current Balance (Optional)</span>
        </div>
        <input :id="`${constants.LOAN_FORM_ID}-current-balance`" v-model.number="currentBalance"
          :class="['input input-bordered input-secondary w-full max-ws']" type="number" step="0.01"
          label="Current Balance">
        <div :class="['label']">
          <span :class="['label-text']">Fees (Optional)</span>
        </div>
        <input :id="`${constants.LOAN_FORM_ID}-fees`" v-model.number="fees"
          :class="['input input-bordered input-secondary w-full max-ws']" type="number" step="0.01" label="Fees">
      </div>
    </template>
    <template #actions>
      <base-button :disabled="!createButtonEnabled" :class="'btn-success'" @click="createLoan">
        {{ createLoanButtonText }}
      </base-button>
    </template>
  </base-modal>
</template>
