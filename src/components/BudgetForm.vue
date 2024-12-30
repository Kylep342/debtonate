<script setup>
import { computed, ref, watch } from 'vue';

import constants from '../constants/constants';
import useCoreStore from '../stores/core';

const coreState = useCoreStore();

<<<<<<< HEAD
const amount = ref(null);
=======
const currentBudget = ref(coreState.getBudget(coreState.currentBudgetId));

const amount = ref(currentBudget.value?.relative);
>>>>>>> main

const createButtonEnabled = computed(
  () => !Number.isNaN(amount.value) && amount.value > 0,
);

watch(
  () => coreState.currentBudgetId,
  (newId) => {
    if (newId && coreState.budgetFormActive) {
<<<<<<< HEAD
      const currentBudget = coreState.getBudget(newId);
      amount.value = currentBudget.relative;
=======
      currentBudget.value = coreState.getBudget(newId);
      amount.value = currentBudget.value.relative;
>>>>>>> main
    }
  },
  { immediate: true },
);

const clearForm = () => {
  amount.value = null;
};

const createBudget = () => {
  coreState.createBudget(amount.value);
  clearForm();
}

const exit = () => {
  clearForm();
  coreState.exitBudgetForm();
};
</script>

<template>
  <base-modal :id="constants.BUDGET_FORM_ID">
    <template #header>
      <h2>{{ coreState.budgetFormTitle }}</h2>
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
          <span :class="['label-text']">Budget</span>
        </div>
        <input
          v-model.number="amount"
          :class="['input input-bordered input-secondary w-full max-ws']"
          type="number"
          label="Budget"
        >
      </div>
    </template>
    <template #actions>
      <base-button
        :disabled="!createButtonEnabled"
        :class="'btn-success'"
        @click="createBudget"
      >
        {{ coreState.createBudgetButtonText }}
      </base-button>
    </template>
  </base-modal>
</template>
