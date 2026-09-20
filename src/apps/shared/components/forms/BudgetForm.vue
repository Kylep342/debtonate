<script setup lang="ts">
import { computed, ref, watch, ComputedRef, Ref } from 'vue';
import { getActivePinia } from 'pinia';
import { useGlobalOptionsStore } from '@/apps/shared/stores/globalOptions';

const props = defineProps<{
  modalId: string;
  title: string;
  label: string;
  initialAmount: number | null;
  saveButtonText: string;
  isActive: boolean;
  onExit: () => void;
  onSubmit: (amount: number) => void;
  minimumAmount?: number | null;
  targetAmount?: number | null;
  placeholder?: string;
  helperText?: string;
}>();

const globalOptions = getActivePinia() ? useGlobalOptionsStore() : null;
const currencySymbol = computed(() =>
  globalOptions ? globalOptions.CurrencySymbol(globalOptions.currency, globalOptions.language) : '$'
);

const inputPlaceholder = computed(() => props.placeholder || props.label);

const hasMinimumAmount = computed(
  () => props.minimumAmount !== undefined && props.minimumAmount !== null
);

const hasTargetAmount = computed(
  () => props.targetAmount !== undefined && props.targetAmount !== null
);

const formattedMinimum = computed(() =>
  globalOptions ? globalOptions.Money(props.minimumAmount || 0) : `$${(props.minimumAmount || 0).toFixed(2)}`
);

const formattedTarget = computed(() =>
  globalOptions ? globalOptions.Money(props.targetAmount || 0) : `$${(props.targetAmount || 0).toFixed(2)}`
);

const formattedExtra = computed(() =>
  globalOptions ? globalOptions.Money(amount.value || 0) : `$${(amount.value || 0).toFixed(2)}`
);

const targetDiff = computed(() => (amount.value || 0) - (props.targetAmount || 0));

const formattedTargetDiff = computed(() =>
  globalOptions ? globalOptions.Money(Math.abs(targetDiff.value)) : `$${Math.abs(targetDiff.value).toFixed(2)}`
);

const formattedTotal = computed(() => {
  const min = props.minimumAmount || 0;
  const extra = amount.value || 0;
  return globalOptions ? globalOptions.Money(min + extra) : `$${(min + extra).toFixed(2)}`;
});

const formattedAnnual = computed(() => {
  const annual = (amount.value || 0) * 12;
  return globalOptions ? globalOptions.Money(annual) : `$${annual.toFixed(2)}`;
});

const amount: Ref<number | null> = ref(props.initialAmount);

const submitButtonEnabled: ComputedRef<boolean> = computed(
  () => amount.value !== null && !Number.isNaN(amount.value) && amount.value > 0
);

watch(
  () => props.initialAmount,
  (newAmount) => {
    amount.value = newAmount;
  },
  { immediate: true },
);

const exit = () => {
  amount.value = null;
  props.onExit();
};

const submit = () => {
  if (amount.value !== null) {
    props.onSubmit(amount.value);
    exit();
  }
};
</script>

<template>
  <base-modal
    :id="modalId"
    :max-width="'md'"
    @exit="exit"
  >
    <template #header>
      <div class="flex items-center gap-2 pl-2">
        <h2 class="text-lg md:text-xl font-bold tracking-tight text-base-content">
          {{ title }}
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
      <div class="p-3 sm:p-4 flex flex-col gap-3">
        <!-- Current Global Minimum Callout Banner (Over Minimum) -->
        <div
          v-if="hasMinimumAmount"
          class="bg-base-200/60 rounded-xl p-3.5 border border-base-content/10 shadow-sm flex flex-col gap-2"
        >
          <div class="flex justify-between items-baseline">
            <span class="text-xs font-semibold uppercase tracking-wider text-base-content/70">
              Current Global Minimum
            </span>
            <span class="font-mono font-bold text-sm sm:text-base text-base-content">
              {{ formattedMinimum }}/mo
            </span>
          </div>
          <p class="text-xs text-base-content/70 leading-relaxed">
            Your loans require a total minimum payment of
            <span class="font-semibold text-base-content font-mono">{{ formattedMinimum }}</span>
            each month. Any amount you add below is
            <span class="font-bold text-primary">in addition</span> to this baseline minimum.
          </p>
        </div>

        <!-- Target Monthly Income Banner (Withdrawals) -->
        <div
          v-else-if="hasTargetAmount"
          class="bg-base-200/60 rounded-xl p-3.5 border border-base-content/10 shadow-sm flex flex-col gap-2"
        >
          <div class="flex justify-between items-baseline">
            <span class="text-xs font-semibold uppercase tracking-wider text-base-content/70">
              Target Monthly Net Income
            </span>
            <span class="font-mono font-bold text-sm sm:text-base text-base-content">
              {{ formattedTarget }}/mo
            </span>
          </div>
          <p class="text-xs text-base-content/70 leading-relaxed">
            Your retirement goal targets a baseline net income of
            <span class="font-semibold text-base-content font-mono">{{ formattedTarget }}</span>
            each month. Enter your proposed monthly withdrawal for this scenario.
          </p>
        </div>

        <div class="bg-base-200/50 rounded-xl p-4 border border-base-content/10 shadow-sm flex flex-col gap-2">
          <label class="label py-1">
            <span class="label-text font-semibold text-xs sm:text-sm text-base-content">
              {{ label }}
            </span>
          </label>
          <div class="relative">
            <span
              class="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono text-base-content/60 pointer-events-none select-none"
            >
              {{ currencySymbol }}
            </span>
            <input
              :id="`${modalId}-amount`"
              v-model.number="amount"
              type="number"
              inputmode="decimal"
              step="0.01"
              :placeholder="inputPlaceholder"
              class="input input-bordered input-sm sm:input-md w-full pl-8 sm:pl-9 bg-base-100/80 focus:input-primary focus:bg-base-100 transition-all font-mono text-base"
            >
          </div>

          <!-- Dynamic Total Calculation Breakdown (Over Minimum) -->
          <div
            v-if="hasMinimumAmount"
            class="mt-2 pt-3 border-t border-base-content/10 flex flex-col gap-1.5"
          >
            <div class="flex justify-between items-center text-xs">
              <span class="text-base-content/70">Baseline Minimum:</span>
              <span class="font-mono text-base-content font-medium">{{ formattedMinimum }}</span>
            </div>
            <div class="flex justify-between items-center text-xs">
              <span class="text-base-content/70">Extra (In Addition):</span>
              <span class="font-mono text-success font-medium">+{{ formattedExtra }}</span>
            </div>
            <div class="flex justify-between items-center text-sm pt-1.5 border-t border-base-content/10 font-bold">
              <span class="text-base-content">Total Monthly Payment:</span>
              <span class="font-mono text-primary">{{ formattedTotal }}/mo</span>
            </div>
          </div>

          <!-- Dynamic Comparison Breakdown (Withdrawal vs Target Net Income) -->
          <div
            v-else-if="hasTargetAmount"
            class="mt-2 pt-3 border-t border-base-content/10 flex flex-col gap-1.5"
          >
            <div class="flex justify-between items-center text-xs">
              <span class="text-base-content/70">Target Net Income:</span>
              <span class="font-mono text-base-content font-medium">{{ formattedTarget }}/mo</span>
            </div>
            <template v-if="amount !== null && amount > 0">
              <div class="flex justify-between items-center text-xs">
                <span class="text-base-content/70">Proposed Monthly Withdrawal:</span>
                <span class="font-mono text-primary font-medium">{{ formattedExtra }}/mo</span>
              </div>
              <div class="flex justify-between items-center text-xs pt-1.5 border-t border-base-content/10 font-bold">
                <span class="text-base-content">Difference vs Target:</span>
                <span
                  v-if="targetDiff > 0"
                  class="font-mono text-success"
                >
                  +{{ formattedTargetDiff }}/mo (Above Target)
                </span>
                <span
                  v-else-if="targetDiff < 0"
                  class="font-mono text-warning"
                >
                  -{{ formattedTargetDiff }}/mo (Below Target)
                </span>
                <span
                  v-else
                  class="font-mono text-primary"
                >
                  Matches Target Goal
                </span>
              </div>
            </template>
            <p
              v-else
              class="text-xs text-base-content/60 mt-0.5"
            >
              Enter a monthly amount to compare against your {{ formattedTarget }}/mo target income.
            </p>
          </div>

          <div
            v-else
            class="flex flex-col gap-1.5 mt-1"
          >
            <p class="text-xs text-base-content/60">
              {{ helperText || 'How much in total per month you want to invest.' }}
            </p>
            <div
              v-if="amount !== null && amount > 0"
              class="pt-2 border-t border-base-content/10 flex justify-between items-center text-xs"
            >
              <span class="text-base-content/70">Annualized Investment:</span>
              <span class="font-mono text-primary font-semibold">{{ formattedAnnual }}/yr</span>
            </div>
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
