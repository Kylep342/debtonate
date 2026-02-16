<script setup lang="ts">
import { computed } from 'vue';
import constants from '@/apps/appreciate/constants/constants';
import { useAppreciateCoreStore, AppreciateCoreStore } from '@/apps/appreciate/stores/core';
import BaseEntityForm from '@/apps/shared/components/forms/BaseEntityForm.vue';
import { FormField } from '@/apps/shared/types/app';

const state: AppreciateCoreStore = useAppreciateCoreStore();

const fields: FormField[] = [
  { key: 'currentBalance', label: 'Current Balance', type: 'number', step: '0.01', required: true },
  { key: 'interestRate', label: 'Interest Rate', type: 'number', step: '0.01', required: true },
  { key: 'name', label: 'Name (Optional)', type: 'text', required: false },
  { key: 'annualLimit', label: 'Annual Limit (Optional)', type: 'number', step: '0.01', required: false },
];

const initialValues = computed(() => {
  if (state.currentInstrumentId && state.instrumentFormActive) {
    const currentInstrument = state.getInstrument(state.currentInstrumentId)!;
    return {
      currentBalance: currentInstrument.currentBalance,
      interestRate: currentInstrument.annualRate * 100,
      name: currentInstrument.name,
      annualLimit: currentInstrument.annualLimit,
    };
  }
  return {
    currentBalance: null,
    interestRate: null,
    name: null,
    annualLimit: null,
  };
});

const saveButtonText = computed(() => state.currentInstrumentId ? constants.BTN_SAVE : constants.BTN_CREATE);

const handleSubmit = (values: Record<string, any>) => {
  state.createInstrument(
    values.currentBalance,
    values.interestRate / 100,
    values.name,
    values.annualLimit
  );
};
</script>

<template>
  <BaseEntityForm
    :modal-id="constants.INSTRUMENT_FORM_ID"
    :title="state.instrumentFormTitle"
    :fields="fields"
    :initial-values="initialValues"
    :save-button-text="saveButtonText"
    :is-active="state.instrumentFormActive"
    :on-exit="state.exitInstrumentForm"
    :on-submit="handleSubmit"
  />
</template>
