<script setup>
import { computed, ref, watch } from 'vue';

import constants from '../constants/constants';
import useCoreStore from '../stores/core';

const state = useCoreStore();

const props = defineProps(['budget', 'createButtonText', 'title']);

const amount = ref(props.budget?.relative);

const createButtonEnabled = computed(
  () => !Number.isNaN(amount.value) && amount.value > 0,
);

watch(
  () => props.budget,
  (newBudget) => {
    if (newBudget) {
      amount.value = newBudget.relative;
    }
  },
  { immediate: true },
);

const clearCreate = () => {
  amount.value = null;
};

const exit = () => {
  state.exitCreateBudgetForm();
  clearCreate();
};
</script>

<template>
  <base-modal :id="constants.BUDGET_FORM_ID">
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
        @click="state.createBudget(amount)"
      >
        {{ createButtonText }}
      </base-button>
    </template>
  </base-modal>
</template>
