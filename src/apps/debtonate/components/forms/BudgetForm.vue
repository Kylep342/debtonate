<script setup lang="ts">
import { computed, ref, watch, ComputedRef, Ref } from 'vue';

import constants from '@/apps/debtonate/constants/constants';
import { useDebtonateCoreStore, DebtonateCoreStore } from '@/apps/debtonate/stores/core';

const state: DebtonateCoreStore = useDebtonateCoreStore();

const amount: Ref<number | null> = ref(null);

const createButtonEnabled: ComputedRef<boolean> = computed(
  () => amount.value !== null && !Number.isNaN(amount.value) && amount.value > 0
);

const createBudgetButtonText: ComputedRef<string> = computed(() => (
  state.currentBudgetId
    ? constants.BTN_SAVE
    : constants.BTN_CREATE
));

watch(
  () => state.currentBudgetId,
  (newId) => {
    if (newId && state.budgetFormActive) {
      const currentBudget = state.getBudget(newId)!;
      amount.value = currentBudget.relative;
    }
  },
  { immediate: true },
);

const clearForm = () => {
  amount.value = null;
};

const exit = () => {
  clearForm();
  state.exitBudgetForm();
};

const createBudget = () => {
  state.createBudget(amount.value);
  exit();
};
</script>

<template>
  <base-modal @exit="exit">
    <template #header>
      <h2>{{ state.budgetFormTitle }}</h2>
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
          <span :class="['label-text']">{{ constants.BUDGET }}</span>
        </div>
        <input
          :id="`${constants.BUDGET_FORM_ID}-amount`"
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
        {{ createBudgetButtonText }}
      </base-button>
    </template>
  </base-modal>
</template>
