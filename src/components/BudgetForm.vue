<script setup>
import { computed, ref, watch } from 'vue';

import constants from '../constants/constants';
import useCoreStore from '../stores/core';

const state = useCoreStore();

const currentBudget = ref(state.getBudget(state.currentBudgetId));

const amount = ref(currentBudget.value?.relative);

const createButtonEnabled = computed(
  () => !Number.isNaN(amount.value) && amount.value > 0,
);

watch(
  () => state.currentBudgetId,
  (newId) => {
    if (newId && state.createBudgetFormActive) {
      currentBudget.value = state.getBudget(newId);
      amount.value = currentBudget.value.relative;
    }
  },
  { immediate: true },
);

const clearCreate = () => {
  amount.value = null;
};

const createBudget = () => {
  state.createBudget(amount.value);
  clearCreate();
}

const exit = () => {
  clearCreate();
  state.exitCreateBudgetForm();
};
</script>

<template>
  <base-modal :id="constants.BUDGET_FORM_ID">
    <template #header>
      <h2>{{ state.createBudgetFormTitle }}</h2>
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
        {{ state.createBudgetButtonText }}
      </base-button>
    </template>
  </base-modal>
</template>
