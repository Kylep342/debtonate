<script setup lang="ts">
import { computed, ref, watch, ComputedRef } from 'vue';
import { getActivePinia } from 'pinia';
import { FormField } from '@/apps/shared/types/app';
import { useGlobalOptionsStore } from '@/apps/shared/stores/globalOptions';

const props = defineProps<{
  modalId: string;
  title: string;
  fields: FormField[];
  initialValues: Record<string, any>;
  saveButtonText: string;
  isActive: boolean;
  onExit: () => void;
  onSubmit: (values: Record<string, any>) => void;
}>();

const globalOptions = getActivePinia() ? useGlobalOptionsStore() : null;
const currencySymbol = computed(() => {
  return globalOptions ? globalOptions.CurrencySymbol(globalOptions.currency, globalOptions.language) : '$';
});

const formData = ref<Record<string, any>>({ ...props.initialValues });

const submitButtonEnabled: ComputedRef<boolean> = computed(() => {
  return props.fields.every(field => {
    if (!field.required) return true;
    const value = formData.value[field.key];
    if (field.type === 'number') {
      return value !== null && !Number.isNaN(value) && value > 0;
    }
    return value !== null && value !== '';
  });
});

const estimatedPayment = computed<number | null>(() => {
  const principal = Number(formData.value.principal || formData.value.currentBalance);
  const rate = Number(formData.value.interestRate);
  const years = Number(formData.value.termInYears);
  if (!principal || !rate || !years || Number.isNaN(principal) || Number.isNaN(rate) || Number.isNaN(years) || principal <= 0 || rate <= 0 || years <= 0) {
    return null;
  }
  const monthlyRate = (rate / 100) / 12;
  const numPayments = years * 12;
  if (monthlyRate === 0) return principal / numPayments;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numPayments));
});

watch(
  () => props.initialValues,
  (newValues) => {
    formData.value = { ...newValues };
  },
  { immediate: true, deep: true },
);

const exit = () => {
  formData.value = {};
  props.onExit();
};

const submit = () => {
  props.onSubmit(formData.value);
  exit();
};

const cleanLabel = (label: string): string => {
  return label.replace(/\s*\(Optional\)\s*/gi, '').trim();
};

const getFieldAdornment = (key: string): string => {
  if (key === 'interestRate') return '%';
  if (key === 'termInYears') return 'yrs';
  return '';
};

const isCurrencyField = (key: string): boolean => {
  return ['principal', 'currentBalance', 'annualLimit', 'fees'].includes(key);
};

const getFieldPlaceholder = (field: FormField): string => {
  if (field.placeholder) return field.placeholder;
  if (field.key === 'name') return 'e.g., Auto Loan, Student Loan, Mortgage';
  if (field.key === 'interestRate') return '0.00';
  if (field.key === 'termInYears') return '30';
  if (field.key === 'currentBalance') return '0.00';
  if (field.key === 'fees') return '0.00';
  if (field.key === 'annualLimit') return '0.00';
  if (isCurrencyField(field.key)) return '0.00';
  return cleanLabel(field.label);
};
</script>

<template>
  <base-modal
    :id="modalId"
    :max-width="'2xl'"
    @exit="exit"
  >
    <template #header>
      <h2 class="text-lg md:text-xl font-bold">
        {{ title }}
      </h2>
    </template>
    <template #headerActions>
      <base-button
        :class="['btn btn-circle btn-ghost btn-sm']"
        @click="exit"
      >
        x
      </base-button>
    </template>
    <template #body>
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div
            v-for="field in fields"
            :key="field.key"
            class="form-control w-full"
            :class="{ 'sm:col-span-2': field.type === 'text' || field.key === 'name' || field.key === 'fees' || field.key === 'annualLimit' }"
          >
            <!-- Clean Single-Line Label -->
            <label
              :for="`${modalId}-${field.key}`"
              class="label py-1 px-0.5 cursor-pointer select-none"
            >
              <span class="label-text font-semibold text-xs sm:text-sm flex items-center gap-1.5">
                {{ cleanLabel(field.label) }}
                <span
                  v-if="field.required"
                  class="text-error font-bold text-xs"
                >*</span>
                <span
                  v-else
                  class="text-xs text-base-content/50 font-normal"
                >(Optional)</span>
              </span>
            </label>

            <!-- Input with Precision Affixes -->
            <div class="relative flex items-center w-full">
              <span
                v-if="isCurrencyField(field.key)"
                class="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono text-base-content/60 pointer-events-none select-none"
              >
                {{ currencySymbol }}
              </span>
              <input
                :id="`${modalId}-${field.key}`"
                v-model="formData[field.key]"
                :type="field.type"
                :inputmode="field.type === 'number' ? 'decimal' : undefined"
                :step="field.step"
                :placeholder="getFieldPlaceholder(field)"
                class="input input-bordered input-sm sm:input-md w-full bg-base-200/40 focus:input-primary focus:bg-base-100 transition-all text-sm sm:text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                :class="[
                  field.type === 'number' ? 'font-mono' : 'font-sans',
                  isCurrencyField(field.key) ? 'pl-8 sm:pl-9' : 'pl-3.5 sm:pl-4',
                  getFieldAdornment(field.key) ? 'pr-10 sm:pr-12' : 'pr-3.5 sm:pr-4',
                ]"
              >
              <span
                v-if="getFieldAdornment(field.key)"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-mono text-base-content/60 pointer-events-none select-none uppercase font-semibold"
              >
                {{ getFieldAdornment(field.key) }}
              </span>
            </div>
          </div>

          <!-- Live Monthly Payment Estimate Callout -->
          <div
            v-if="estimatedPayment !== null"
            class="sm:col-span-2 p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-between text-xs sm:text-sm"
          >
            <div class="flex items-center gap-2">
              <span class="font-bold text-base-content">Monthly Payment</span>
              <span class="text-xs opacity-60 hidden sm:inline">(principal + interest)</span>
            </div>
            <span class="font-mono font-bold text-primary text-sm sm:text-base">
              {{ currencySymbol }}{{ estimatedPayment.toFixed(2) }}/mo
            </span>
          </div>
        </div>
      </div>
    </template>
    <template #actions>
      <div class="flex items-center justify-end gap-2 w-full">
        <base-button
          class="btn-sm btn-ghost"
          @click="exit"
        >
          Cancel
        </base-button>
        <base-button
          :disabled="!submitButtonEnabled"
          class="btn-sm btn-success"
          @click="submit"
        >
          {{ saveButtonText }}
        </base-button>
      </div>
    </template>
  </base-modal>
</template>
