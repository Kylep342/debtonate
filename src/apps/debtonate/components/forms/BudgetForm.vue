<script setup lang="ts">
import { computed } from 'vue';
import constants from '@/apps/debtonate/constants/constants';
import { useDebtonateCoreStore, DebtonateCoreStore } from '@/apps/debtonate/stores/core';
import SharedBudgetForm from '@/apps/shared/components/forms/BudgetForm.vue';

const state: DebtonateCoreStore = useDebtonateCoreStore();

const initialAmount = computed(() => {
  if (state.currentBudgetId && state.budgetFormActive) {
    const currentBudget = state.getBudget(state.currentBudgetId)!;
    return currentBudget.relative;
  }
  return null;
});

const saveButtonText = computed(() => state.currentBudgetId ? constants.BTN_SAVE : constants.BTN_CREATE);

const handleSubmit = (amount: number) => {
  state.createBudget(amount);
};
</script>

<template>
  <SharedBudgetForm
    :modal-id="constants.BUDGET_FORM_ID"
    :title="state.budgetFormTitle"
    :label="constants.BUDGET"
    :initial-amount="initialAmount"
    :save-button-text="saveButtonText"
    :is-active="state.budgetFormActive"
    :on-exit="state.exitBudgetForm"
    :on-submit="handleSubmit"
  />
</template>
