<script setup lang="ts">
import { computed, ComputedRef } from 'vue';
import constants from '@/apps/appreciate/constants/constants';
import { useAppreciateCoreStore, AppreciateCoreStore } from '@/apps/appreciate/stores/core';
import SharedBudgetForm from '@/apps/shared/components/forms/BudgetForm.vue';

const state: AppreciateCoreStore = useAppreciateCoreStore();

const isCareerPhase = computed(() => state.viewPhase === constants.PHASE_CAREER);

const initialAmount = computed(() => {
  if (state.currentBudgetId && state.budgetFormActive) {
    const currentBudget = isCareerPhase.value
      ? state.getBudget(state.currentBudgetId)!
      : state.getWithdrawalBudget(state.currentBudgetId)!;
    return currentBudget.relative;
  }
  return null;
});

const title = computed(() => isCareerPhase.value ? state.budgetFormTitle : 'Creating Withdrawal Scenario');
const label = computed(() => isCareerPhase.value ? constants.BUDGET : constants.WITHDRAWAL);
const saveButtonText = computed(() => state.currentBudgetId ? constants.BTN_SAVE : constants.BTN_CREATE);

const handleSubmit = (amount: number) => {
  if (isCareerPhase.value) {
    state.createBudget(amount);
  } else {
    state.createWithdrawalBudget(amount);
  }
};
</script>

<template>
  <SharedBudgetForm
    :modal-id="constants.BUDGET_FORM_ID"
    :title="title"
    :label="label"
    :initial-amount="initialAmount"
    :save-button-text="saveButtonText"
    :is-active="state.budgetFormActive"
    :on-exit="state.exitBudgetForm"
    :on-submit="handleSubmit"
  />
</template>
