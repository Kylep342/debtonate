<script setup lang="ts">
import { computed } from 'vue';
import constants from '@/apps/debtonate/constants/constants';
import { useDebtonateCoreStore, DebtonateCoreStore } from '@/apps/debtonate/stores/core';
import BaseEntityForm from '@/apps/shared/components/forms/BaseEntityForm.vue';
import { FormField } from '@/apps/shared/types/app';

const state: DebtonateCoreStore = useDebtonateCoreStore();

const fields: FormField[] = [
  { key: 'name', label: 'Loan Name (Optional)', type: 'text', required: false },
  { key: 'principal', label: 'Principal', type: 'number', step: '0.01', required: true },
  { key: 'currentBalance', label: 'Current Balance (Optional)', type: 'number', step: '0.01', required: false },
  { key: 'interestRate', label: 'Interest Rate', type: 'number', step: '0.01', required: true },
  { key: 'termInYears', label: 'Loan Term', type: 'number', required: true },
  { key: 'fees', label: 'Fees (Optional)', type: 'number', step: '0.01', required: false },
];

const initialValues = computed(() => {
  if (state.currentLoanId && state.loanFormActive) {
    const currentLoan = state.getLoan(state.currentLoanId)!;
    return {
      name: currentLoan.name,
      principal: currentLoan.principal,
      currentBalance: currentLoan.currentBalance,
      interestRate: currentLoan.annualRate * 100,
      termInYears: currentLoan.termInYears,
      fees: currentLoan.fees,
    };
  }
  return {
    name: null,
    principal: null,
    currentBalance: null,
    interestRate: null,
    termInYears: null,
    fees: null,
  };
});


const saveButtonText = computed(() => state.currentLoanId ? constants.BTN_SAVE : constants.BTN_CREATE);

const handleSubmit = (values: Record<string, any>) => {
  state.createLoan(
    values.principal,
    values.interestRate / 100,
    values.termInYears,
    values.name,
    values.currentBalance,
    values.fees,
  );
};
</script>

<template>
  <BaseEntityForm
    :modal-id="constants.LOAN_FORM_ID"
    :title="state.loanFormTitle"
    :fields="fields"
    :initial-values="initialValues"
    :save-button-text="saveButtonText"
    :is-active="state.loanFormActive"
    :on-exit="state.exitLoanForm"
    :on-submit="handleSubmit"
  />
</template>
