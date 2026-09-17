<script setup lang="ts">
import { computed, ref, watch, ComputedRef, Ref } from 'vue';
import { getActivePinia } from 'pinia';

import constants from '@/apps/debtonate/constants/constants';
import { useDebtonateCoreStore, DebtonateCoreStore } from '@/apps/debtonate/stores/core';
import { useGlobalOptionsStore } from '@/apps/shared/stores/globalOptions';

const state: DebtonateCoreStore = useDebtonateCoreStore();
const globalOptions = getActivePinia() ? useGlobalOptionsStore() : null;
const currencySymbol = computed(() =>
  globalOptions ? globalOptions.CurrencySymbol(globalOptions.currency, globalOptions.language) : '$'
);

const loanId: Ref<string | null> = ref(null);
const currentBalance: Ref<number | null> = ref(null);
const interestRate: Ref<number | null> = ref(null);
const termInYears: Ref<number | null> = ref(null);
const name: Ref<string | null> = ref(null);
const fees: Ref<number | null> = ref(null);

const parentLoan = computed(() => {
  return loanId.value ? state.getLoan(loanId.value) : null;
});

const createButtonEnabled: ComputedRef<boolean> = computed(
  () => [currentBalance.value, interestRate.value, termInYears.value].every(
    (input) => input !== null && !Number.isNaN(input) && input > 0,
  ),
);

const estimatedNewPayment = computed<number | null>(() => {
  if (!createButtonEnabled.value || !currentBalance.value || !interestRate.value || !termInYears.value) {
    return null;
  }
  const principal = currentBalance.value + (fees.value || 0);
  const monthlyRate = (interestRate.value / 100) / 12;
  const numPayments = termInYears.value * 12;
  if (monthlyRate === 0) {
    return principal / numPayments;
  }
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numPayments));
});

watch(
  () => state.currentLoanId,
  (newId) => {
    if (newId && state.refinancingFormActive) {
      loanId.value = newId;
      const currentLoan = state.getLoan(loanId.value)!;
      currentBalance.value = currentLoan.currentBalance;
    }
  },
  { immediate: true },
);

const clearForm = () => {
  currentBalance.value = null;
  interestRate.value = null;
  termInYears.value = null;
  name.value = null;
  fees.value = null;
};

const exit = () => {
  clearForm();
  state.exitRefinancingForm();
};

const refinanceLoan = () => {
  state.createRefinanceScenario(
    loanId.value || '',
    currentBalance.value || 0,
    (interestRate.value || 0) / 100,
    termInYears.value || 0,
    name.value || '',
    fees.value || 0,
  );
  exit();
};
</script>

<template>
  <base-modal
    :id="constants.REFINANCING_FORM_ID"
    :max-width="'lg'"
    @exit="exit"
  >
    <template #header>
      <div class="flex items-center gap-2 pl-2">
        <h2 class="text-lg md:text-xl font-bold tracking-tight text-base-content">
          {{ state.refinancingFormTitle }}
        </h2>
      </div>
    </template>
    <template #headerActions>
      <base-button
        class="btn btn-circle btn-ghost btn-sm"
        @click="exit"
      >
        x
      </base-button>
    </template>
    <template #body>
      <div class="p-3 sm:p-4 flex flex-col gap-4">
        <!-- Parent Loan Summary Card -->
        <div
          v-if="parentLoan"
          class="bg-base-200/40 rounded-xl p-3 border border-base-content/10 flex flex-wrap items-center justify-between gap-3 text-xs"
        >
          <div>
            <span class="font-semibold text-base-content">{{ parentLoan.name || 'Current Loan' }}:</span>
            <span class="ml-1 text-base-content/70">
              Balance {{ globalOptions ? globalOptions.Money(parentLoan.currentBalance) : `${currencySymbol}${parentLoan.currentBalance}` }}
            </span>
          </div>
          <div class="flex items-center gap-2 font-mono">
            <span class="badge badge-sm badge-secondary">
              {{ (Number(parentLoan.annualRate) * 100).toFixed(2) }}% APR
            </span>
            <span class="text-base-content/70">
              {{ parentLoan.termInYears }} yrs
            </span>
          </div>
        </div>

        <!-- Refinancing Scenario Form Inputs -->
        <div class="bg-base-200/50 rounded-xl p-4 border border-base-content/10 shadow-sm flex flex-col gap-3.5">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <!-- Principal -->
            <div class="form-control w-full">
              <label class="label py-1">
                <span class="label-text font-semibold text-xs sm:text-sm text-base-content flex items-center gap-1">
                  Principal
                  <span class="text-error text-xs">*</span>
                </span>
              </label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-base-content/60 pointer-events-none select-none">
                  {{ currencySymbol }}
                </span>
                <input
                  :id="`${constants.REFINANCING_FORM_ID}-current-balance`"
                  v-model.number="currentBalance"
                  type="number"
                  inputmode="decimal"
                  step="0.01"
                  placeholder="Principal"
                  class="input input-bordered input-sm sm:input-md w-full pl-8 sm:pl-9 pr-3.5 sm:pr-4 bg-base-100/80 focus:input-primary focus:bg-base-100 transition-all font-mono text-sm sm:text-base"
                >
              </div>
            </div>

            <!-- Interest Rate -->
            <div class="form-control w-full">
              <label class="label py-1">
                <span class="label-text font-semibold text-xs sm:text-sm text-base-content flex items-center gap-1">
                  Interest Rate
                  <span class="text-error text-xs">*</span>
                </span>
              </label>
              <div class="relative">
                <input
                  :id="`${constants.REFINANCING_FORM_ID}-interest-rate`"
                  v-model.number="interestRate"
                  type="number"
                  inputmode="decimal"
                  step="0.01"
                  placeholder="Interest Rate"
                  class="input input-bordered input-sm sm:input-md w-full pl-3.5 sm:pl-4 pr-10 sm:pr-12 bg-base-100/80 focus:input-primary focus:bg-base-100 transition-all font-mono text-sm sm:text-base"
                >
                <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-mono text-base-content/60 pointer-events-none select-none font-semibold">
                  %
                </span>
              </div>
            </div>

            <!-- Term In Years -->
            <div class="form-control w-full">
              <label class="label py-1">
                <span class="label-text font-semibold text-xs sm:text-sm text-base-content flex items-center gap-1">
                  Term (In Years)
                  <span class="text-error text-xs">*</span>
                </span>
              </label>
              <div class="relative">
                <input
                  :id="`${constants.REFINANCING_FORM_ID}-term-in-years`"
                  v-model.number="termInYears"
                  type="number"
                  inputmode="decimal"
                  placeholder="Term In Years"
                  class="input input-bordered input-sm sm:input-md w-full pl-3.5 sm:pl-4 pr-10 sm:pr-12 bg-base-100/80 focus:input-primary focus:bg-base-100 transition-all font-mono text-sm sm:text-base"
                >
                <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-mono text-base-content/60 pointer-events-none select-none uppercase font-semibold">
                  yrs
                </span>
              </div>
            </div>

            <!-- Fees -->
            <div class="form-control w-full">
              <label class="label py-1">
                <span class="label-text font-semibold text-xs sm:text-sm text-base-content">
                  Fees (Optional)
                </span>
              </label>
              <div class="relative">
                <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono text-base-content/60 pointer-events-none select-none">
                  {{ currencySymbol }}
                </span>
                <input
                  :id="`${constants.REFINANCING_FORM_ID}-fees`"
                  v-model.number="fees"
                  type="number"
                  inputmode="decimal"
                  step="0.01"
                  placeholder="Fees"
                  class="input input-bordered input-sm sm:input-md w-full pl-8 sm:pl-9 pr-3.5 sm:pr-4 bg-base-100/80 focus:input-primary focus:bg-base-100 transition-all font-mono text-sm sm:text-base"
                >
              </div>
            </div>

            <!-- Scenario Name -->
            <div class="form-control w-full sm:col-span-2">
              <label class="label py-1">
                <span class="label-text font-semibold text-xs sm:text-sm text-base-content">
                  Scenario Name (Optional)
                </span>
              </label>
              <input
                :id="`${constants.REFINANCING_FORM_ID}-name`"
                v-model="name"
                type="text"
                placeholder="e.g., 15-Year Fixed Refi"
                class="input input-bordered input-sm sm:input-md w-full bg-base-100/80 focus:input-primary focus:bg-base-100 transition-all text-sm"
              >
            </div>
          </div>

          <!-- Estimated Monthly Payment Callout -->
          <div
            v-if="estimatedNewPayment !== null"
            class="mt-1 p-2.5 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-between text-xs"
          >
            <span class="text-base-content font-medium">Estimated New Monthly Payment:</span>
            <span class="font-mono font-bold text-primary text-sm">
              {{ globalOptions ? globalOptions.Money(estimatedNewPayment) : `${currencySymbol}${estimatedNewPayment.toFixed(2)}` }}/mo
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
          :disabled="!createButtonEnabled"
          class="btn-sm btn-success"
          @click="refinanceLoan"
        >
          {{ constants.BTN_REFINANCE }}
        </base-button>
      </div>
    </template>
  </base-modal>
</template>
