<script setup>
import { computed, ref, watch } from 'vue';

import constants from '../constants/constants';
import useCoreStore from '../stores/core';

const state = useCoreStore();

const props = defineProps(['createButtonText', 'loan', 'title']);

const principal = ref(props.loan?.principal || 0);
const interestRate = ref((props.loan?.annualRate || 0) * 100);
const termInYears = ref(props.loan?.termInYears || 0);
const name = ref(props.loan?.name || '');

const createButtonEnabled = computed(
  () => [principal.value, interestRate.value, termInYears.value].every(
    (input) => !Number.isNaN(input) && input > 0,
  ),
);

watch(
  () => props.loan,
  (newLoan) => {
    if (newLoan) {
      principal.value = newLoan.principal;
      interestRate.value = newLoan.annualRate * 100;
      termInYears.value = newLoan.termInYears;
      name.value = newLoan.name || '';
    }
  },
  { immediate: true },
);

const clearCreate = () => {
  principal.value = null;
  interestRate.value = null;
  termInYears.value = null;
  name.value = null;
};

const createLoan = () => {
  state.createLoan(
    principal.value,
    interestRate.value / 100,
    termInYears.value,
    name.value,
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
      <h2>{{ title }}</h2>
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
      </div>
    </template>
    <template #actions>
      <base-button
        :disabled="!createButtonEnabled"
        :class="'btn-success'"
        @click="createLoan"
      >
        {{ createButtonText }}
      </base-button>
    </template>
  </base-modal>
</template>
