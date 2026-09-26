<script setup lang="ts">
import { computed, ref, ComputedRef } from 'vue';

import constants from '@/apps/debtonate/constants/constants';
import { useDebtonateCoreStore, DebtonateCoreStore } from '@/apps/debtonate/stores/core';
import GlobalOptionsFormlet from '@/apps/shared/components/forms/GlobalOptionsFormlet.vue';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
const state: DebtonateCoreStore = useDebtonateCoreStore();

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'strategy', label: 'Strategy' },
  { key: 'display', label: 'Display' },
  { key: 'storage', label: 'Data' },
] as const;

type TabKey = typeof tabs[number]['key'];
const activeTab = ref<TabKey>('all');

const isCopied = ref<boolean>(false);
const copyTimeout = ref<any>(null);

const copyStateToClipboard = async (): Promise<void> => {
  const clipboard = (typeof navigator !== 'undefined' && navigator.clipboard)
    || (typeof window !== 'undefined' && window.navigator && window.navigator.clipboard);
  if (clipboard && clipboard.writeText) {
    await clipboard.writeText(JSON.stringify(state.exportState()));
    isCopied.value = true;
    if (copyTimeout.value) clearTimeout(copyTimeout.value);
    copyTimeout.value = setTimeout(() => {
      isCopied.value = false;
    }, 2000);
  }
};

const reducePaymentsExample: ComputedRef<string> = computed(
  () => (state.loans.length ? (`Paying off ${state.getLoanName(state.loans[0].id)} reduces future payments by ${globalOptions.Money(state.loans[0].minPayment)}`) : ''),
);

const refinancingUseHighestPaymentExample: ComputedRef<string> = computed(() => {
  if (state.loans.length) {
    const firstLoan = state.loans[0];
    const basePayment = firstLoan.minPayment;
    const hypotheticalPayment = Math.max(firstLoan.minPayment - (firstLoan.minPayment % 10), 100);
    const usedPayment = state.refinancingUseHighestPayment ? Math.max(basePayment, hypotheticalPayment) : hypotheticalPayment;
    return `A scenario for ${state.getLoanName(firstLoan.id)} [${globalOptions.Money(basePayment)}] with minimum ${globalOptions.Money(hypotheticalPayment)} uses ${globalOptions.Money(usedPayment)}`;
  }
  return '';
});

const repaymentPriorityExample: ComputedRef<string> = computed(
  () => (state.loans.length ? (`Priority: ${state.loans.map((l: any) => state.getLoanName(l.id)).join(', ')}`) : ''),
);

const buttonStyle = (flag: boolean): string => (flag ? 'btn-success' : 'btn-ghost border border-base-content/20');
const buttonText = (flag: boolean): string => (flag ? constants.BTN_ON : constants.BTN_OFF);
</script>

<template>
  <base-modal
    :id="constants.OPTIONS_FORM_ID"
    :max-width="'2xl'"
    @exit="state.exitOptionsForm"
  >
    <template #header>
      <div class="flex items-center gap-2 pl-2">
        <h2 class="text-lg md:text-xl font-bold tracking-tight text-base-content">
          Debtonate Options
        </h2>
      </div>
    </template>
    <template #headerActions>
      <base-button
        class="btn btn-circle btn-ghost btn-sm"
        @click="state.exitOptionsForm"
      >
        x
      </base-button>
    </template>
    <template #subHeader>
      <div class="flex gap-1 p-1 bg-base-300/40 rounded-xl w-full">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="btn btn-xs sm:btn-sm flex-1 text-center text-xs sm:text-sm font-medium px-1.5 sm:px-4 transition-all"
          :class="activeTab === tab.key ? 'btn-primary' : 'btn-ghost text-base-content/70 hover:text-base-content'"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>
    </template>
    <template #body>
      <div class="p-3 sm:p-4 flex flex-col gap-4 min-h-[480px] sm:min-h-[575px]">
        <!-- Tab 1: Strategy & Priority -->
        <div
          v-if="activeTab === 'all' || activeTab === 'strategy'"
          class="flex flex-col gap-3 flex-1"
        >
          <div
            v-if="activeTab === 'all'"
            class="text-xs uppercase tracking-wider font-bold opacity-60 px-1 pt-1"
          >
            Strategy & Priority
          </div>
          <!-- Repayment Priority -->
          <div class="bg-base-200/50 rounded-xl p-4 border border-base-content/10 shadow-sm flex flex-col gap-2">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <span class="font-bold text-sm text-base-content">Repayment Priority Method</span>
                <p class="text-xs text-base-content/70 mt-0.5">
                  Choose how extra budget is directed across your debts.
                </p>
              </div>
              <div class="join w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  class="join-item btn btn-xs sm:btn-sm flex-1 sm:flex-initial flex flex-col sm:flex-row sm:flex-nowrap h-auto min-h-[2.25rem] sm:min-h-[2rem] py-1.5 sm:py-1 px-2.5 sm:px-3 items-center justify-center leading-normal"
                  :class="!state.snowballSort ? 'btn-primary' : 'btn-ghost border border-base-content/20'"
                  @click="state.toggleAvalancheSort"
                >
                  <span class="font-semibold whitespace-nowrap">Avalanche</span>
                  <span class="text-[10px] sm:text-xs opacity-75 font-normal whitespace-nowrap sm:ml-1.5">(High APR)</span>
                </button>
                <button
                  type="button"
                  class="join-item btn btn-xs sm:btn-sm flex-1 sm:flex-initial flex flex-col sm:flex-row sm:flex-nowrap h-auto min-h-[2.25rem] sm:min-h-[2rem] py-1.5 sm:py-1 px-2.5 sm:px-3 items-center justify-center leading-normal"
                  :class="state.snowballSort ? 'btn-primary' : 'btn-ghost border border-base-content/20'"
                  @click="state.toggleSnowballSort"
                >
                  <span class="font-semibold whitespace-nowrap">Snowball</span>
                  <span class="text-[10px] sm:text-xs opacity-75 font-normal whitespace-nowrap sm:ml-1.5">(Low Balance)</span>
                </button>
              </div>
            </div>
            <div
              v-if="repaymentPriorityExample"
              class="font-mono text-xs bg-base-300/60 px-2.5 py-1.5 rounded-lg text-primary border border-base-content/10 mt-1 break-words"
            >
              {{ repaymentPriorityExample }}
            </div>
          </div>

          <!-- Reduce Payments -->
          <div class="bg-base-200/50 rounded-xl p-4 border border-base-content/10 shadow-sm flex flex-col gap-2">
            <div class="flex items-center justify-between gap-2">
              <div>
                <span class="font-bold text-sm text-base-content">Reduce Minimum Payments</span>
                <p class="text-xs text-base-content/70 mt-0.5">
                  Lower your baseline monthly commitment as individual loans are paid off.
                </p>
              </div>
              <base-button
                :class="buttonStyle(state.reducePayments)"
                class="btn-xs sm:btn-sm"
                @click="state.toggleReducePayments"
              >
                {{ buttonText(state.reducePayments) }}
              </base-button>
            </div>
            <div
              v-if="reducePaymentsExample"
              class="font-mono text-xs bg-base-300/60 px-2.5 py-1.5 rounded-lg text-primary border border-base-content/10 mt-1 break-words"
            >
              {{ reducePaymentsExample }}
            </div>
          </div>

          <!-- Refinancing - Use Highest Payment -->
          <div class="bg-base-200/50 rounded-xl p-4 border border-base-content/10 shadow-sm flex flex-col gap-2">
            <div class="flex items-center justify-between gap-2">
              <div>
                <span class="font-bold text-sm text-base-content">Refinancing - Use Highest Payment</span>
                <p class="text-xs text-base-content/70 mt-0.5">
                  Maintain the original monthly payment amount after refinancing to accelerate payoff.
                </p>
              </div>
              <base-button
                :class="buttonStyle(state.refinancingUseHighestPayment)"
                class="btn-xs sm:btn-sm"
                @click="state.toggleRefinancingUseHighestPayment"
              >
                {{ buttonText(state.refinancingUseHighestPayment) }}
              </base-button>
            </div>
            <div
              v-if="refinancingUseHighestPaymentExample"
              class="font-mono text-xs bg-base-300/60 px-2.5 py-1.5 rounded-lg text-primary border border-base-content/10 mt-1 break-words"
            >
              {{ refinancingUseHighestPaymentExample }}
            </div>
          </div>

          <!-- Contribution Rounding -->
          <div class="bg-base-200/50 rounded-xl p-4 border border-base-content/10 shadow-sm flex flex-col gap-2">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span class="font-bold text-sm text-base-content">Round Minimum Contribution</span>
                <p class="text-xs text-base-content/70 mt-0.5">
                  Round your monthly payment up to the next multiple of your chosen scale.
                </p>
              </div>
              <div class="flex items-center gap-2">
                <input
                  :id="`${constants.OPTIONS_FORM_ID}-rounding-scale`"
                  v-model.number="state.roundingScale"
                  type="number"
                  inputmode="numeric"
                  step="1"
                  min="1"
                  class="input input-bordered input-xs sm:input-sm w-20 font-mono text-right bg-base-100/80"
                >
                <base-button
                  :class="buttonStyle(state.roundingEnabled)"
                  class="btn-xs sm:btn-sm"
                  @click="state.toggleRounding(state.roundingScale)"
                >
                  {{ buttonText(state.roundingEnabled) }}
                </base-button>
              </div>
            </div>
            <div class="text-xs text-base-content/60 mt-1">
              Current total minimum payment: <span class="font-mono font-semibold text-base-content">{{ globalOptions.Money(state.totalMinPayment) }}</span>
            </div>
          </div>
        </div>

        <!-- Tab 2: Display & Regional -->
        <div
          v-if="activeTab === 'all' || activeTab === 'display'"
          class="flex flex-col gap-3 flex-1"
        >
          <div
            v-if="activeTab === 'all'"
            class="text-xs uppercase tracking-wider font-bold opacity-60 px-1 pt-3 border-t border-base-content/10"
          >
            Display & Regional
          </div>
          <global-options-formlet />
        </div>

        <!-- Tab 3: Data & Storage -->
        <div
          v-if="activeTab === 'all' || activeTab === 'storage'"
          class="flex flex-col gap-3 flex-1"
        >
          <div
            v-if="activeTab === 'all'"
            class="text-xs uppercase tracking-wider font-bold opacity-60 px-1 pt-3 border-t border-base-content/10"
          >
            Data & Storage
          </div>
          <!-- Privacy & Data Ownership Disclaimer -->
          <div class="bg-base-200/50 rounded-xl p-4 border border-base-content/10 shadow-sm flex flex-col gap-1.5">
            <div class="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4 text-primary shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <span class="font-bold text-sm text-base-content">Privacy & Data Ownership</span>
            </div>
            <p class="text-xs text-base-content/70 leading-relaxed">
              All data and calculation activity remain strictly within your browser. No financial details are ever transmitted to or stored on an external server. Saving, exporting, sharing, or deleting your plan is completely at your discretion.
            </p>
          </div>

          <div class="bg-base-200/50 rounded-xl p-4 border border-base-content/10 shadow-sm flex flex-col gap-3">
            <div>
              <span class="font-bold text-sm text-base-content">Browser Local Storage & State</span>
              <p class="text-xs text-base-content/70 mt-1">
                Save your current loan portfolio to this browser, reload saved data, or copy a snapshot to your clipboard.
              </p>
            </div>
            <div class="flex flex-wrap gap-2 pt-1">
              <base-button
                class="btn-xs sm:btn-sm btn-info btn-outline"
                @click="state.loadState"
              >
                {{ constants.BTN_LOAD }}
              </base-button>
              <base-button
                class="btn-xs sm:btn-sm btn-primary"
                @click="state.saveState"
              >
                {{ constants.BTN_SAVE }}
              </base-button>
              <base-button
                class="btn-xs sm:btn-sm"
                :class="isCopied ? 'btn-success' : 'btn-neutral btn-outline'"
                @click="copyStateToClipboard"
              >
                {{ isCopied ? 'Copied!' : constants.BTN_COPY }}
              </base-button>
              <base-button
                class="btn-xs sm:btn-sm btn-error btn-outline"
                @click="state.clearState"
              >
                {{ constants.BTN_CLEAR }}
              </base-button>
            </div>
          </div>

          <div class="bg-base-200/50 rounded-xl p-4 border border-base-content/10 shadow-sm flex flex-col gap-2">
            <div class="flex items-center justify-between gap-2">
              <div>
                <span class="font-bold text-sm text-base-content">Share Plan & Export Schedules</span>
                <p class="text-xs text-base-content/70 mt-1">
                  Generate compressed URL links, download workspace backup JSON, or export amortization tables.
                </p>
              </div>
              <base-button
                class="btn-xs sm:btn-sm btn-primary"
                @click="globalOptions.openShareExport"
              >
                {{ constants.BTN_SHARE_EXPORT }}
              </base-button>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #actions>
      <div class="flex items-center justify-end w-full">
        <base-button
          class="btn-sm btn-primary"
          @click="state.exitOptionsForm"
        >
          Done
        </base-button>
      </div>
    </template>
  </base-modal>
</template>
