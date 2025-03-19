<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import constants from '@/apps/debtonate/constants/constants';
import useCoreStore from '@/apps/debtonate/stores/core';

const coreState = useCoreStore();

const amount = ref<number | null>(null);

const createButtonEnabled = computed<boolean>(
  () => !Number.isNaN(amount.value) && amount.value > 0
);

const createBudgetButtonText = computed<string>(() => (
  coreState.currentBudgetId
    ? constants.BTN_SAVE
    : constants.BTN_CREATE
));

watch(
  () => coreState.currentBudgetId,
  (newId) => {
    if (newId && coreState.budgetFormActive) {
      const currentBudget = coreState.getBudget(newId);
      amount.value = currentBudget.relative;
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
};

const exit = () => {
  clearForm();
  coreState.exitBudgetForm();
};
</script>

<template>
  <base-modal :id="constants.BUDGET_FORM_ID" @exit="exit">
    <template #header>
      <h2>{{ coreState.budgetFormTitle }}</h2>
    </template>
    <template #headerActions>
      <base-button :class="['btn btn-circle btn-ghost']" @click="exit">
        x
      </base-button>
    </template>
    <template #body>
      <div :class="['formInputs']">
        <div :class="['label']">
          <span :class="['label-text']">{{ constants.BUDGET }}</span>
        </div>
        <input :id="`${constants.BUDGET_FORM_ID}-amount`" v-model.number="amount"
          :class="['input input-bordered input-secondary w-full max-ws']" type="number" label="Budget">
      </div>
    </template>
    <template #actions>
      <base-button :disabled="!createButtonEnabled" :class="'btn-success'" @click="createBudget">
        {{ createBudgetButtonText }}
      </base-button>
    </template>
  </base-modal>
</template>
