<script setup lang="ts">
import { computed, ref, ComputedRef } from 'vue';

import constants from '@/apps/appreciate/constants/constants';
import { useAppreciateCoreStore, AppreciateCoreStore } from '@/apps/appreciate/stores/core';
import GlobalOptionsFormlet from '@/apps/shared/components/forms/GlobalOptionsFormlet.vue';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
const state: AppreciateCoreStore = useAppreciateCoreStore();

const activeTab = ref<'growth' | 'retirement' | 'display' | 'storage'>('growth');

const copyStateToClipboard = () => navigator.clipboard.writeText(
  JSON.stringify(state.exportState())
);

const deflationExample: ComputedRef<string> = computed(
  () => `When enabled this deflates all future money to current year money (CYM) at a rate of ${globalOptions.Percent(state.inflationFactor)} per year`
);

const buttonStyle = (flag: boolean) => (flag ? 'btn-success' : 'btn-ghost border border-base-content/20');
const buttonText = (flag: boolean) => (flag ? constants.BTN_ON : constants.BTN_OFF);
</script>

<template>
  <base-modal
    :max-width="'2xl'"
    @exit="state.exitOptionsForm"
  >
    <template #header>
      <div class="flex items-center gap-2 pl-2">
        <h2 class="text-lg md:text-xl font-bold tracking-tight text-base-content">
          Appreciate Options
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
    <template #body>
      <div class="p-3 sm:p-4 flex flex-col gap-4 min-h-[480px] sm:min-h-[520px]">
        <!-- Segmented Navigation Tabs -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-base-300/40 rounded-xl">
          <button
            type="button"
            class="btn btn-xs sm:btn-sm text-center text-xs sm:text-sm font-medium px-2 sm:px-3"
            :class="activeTab === 'growth' ? 'btn-primary' : 'btn-ghost'"
            @click="activeTab = 'growth'"
          >
            Growth
          </button>
          <button
            type="button"
            class="btn btn-xs sm:btn-sm text-center text-xs sm:text-sm font-medium px-2 sm:px-3"
            :class="activeTab === 'retirement' ? 'btn-primary' : 'btn-ghost'"
            @click="activeTab = 'retirement'"
          >
            Retirement
          </button>
          <button
            type="button"
            class="btn btn-xs sm:btn-sm text-center text-xs sm:text-sm font-medium px-2 sm:px-3"
            :class="activeTab === 'display' ? 'btn-primary' : 'btn-ghost'"
            @click="activeTab = 'display'"
          >
            Display
          </button>
          <button
            type="button"
            class="btn btn-xs sm:btn-sm text-center text-xs sm:text-sm font-medium px-2 sm:px-3"
            :class="activeTab === 'storage' ? 'btn-primary' : 'btn-ghost'"
            @click="activeTab = 'storage'"
          >
            Data
          </button>
        </div>

        <!-- Tab 1: Growth & Inflation -->
        <div
          v-if="activeTab === 'growth'"
          class="flex flex-col gap-3 flex-1"
        >
          <!-- Accrue Before Contribution -->
          <div class="bg-base-200/50 rounded-xl p-4 border border-base-content/10 shadow-sm flex flex-col gap-2">
            <div class="flex items-center justify-between gap-2">
              <div>
                <span class="font-bold text-sm text-base-content">Accrue Before Contribution</span>
                <p class="text-xs text-base-content/70 mt-0.5">
                  When enabled, growth accrues on the existing balance before adding each period's contribution.
                </p>
              </div>
              <base-button
                :class="buttonStyle(state.accrueBeforeContribution)"
                class="btn-xs sm:btn-sm"
                @click="state.toggleAccrueBeforeContribution"
              >
                {{ buttonText(state.accrueBeforeContribution) }}
              </base-button>
            </div>
          </div>

          <!-- Inflation & Deflation -->
          <div class="bg-base-200/50 rounded-xl p-4 border border-base-content/10 shadow-sm flex flex-col gap-2">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span class="font-bold text-sm text-base-content">Inflation Adjustment (CYM)</span>
                <p class="text-xs text-base-content/70 mt-0.5">
                  Deflate future projected values to Current Year Money purchasing power.
                </p>
              </div>
              <div class="flex items-center gap-2">
                <div class="relative">
                  <input
                    :id="`${constants.OPTIONS_FORM_ID}-inflation-factor`"
                    v-model.number="state.inflationFactor"
                    type="number"
                    step="0.01"
                    class="input input-bordered input-xs sm:input-sm w-20 pr-6 font-mono text-right bg-base-100/80"
                  >
                  <span class="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-mono text-base-content/60 pointer-events-none select-none">%</span>
                </div>
                <base-button
                  :class="buttonStyle(state.deflateAllMoney)"
                  class="btn-xs sm:btn-sm"
                  @click="state.toggleDeflateAllMoney(state.inflationFactor)"
                >
                  {{ buttonText(state.deflateAllMoney) }}
                </base-button>
              </div>
            </div>
            <div class="font-mono text-xs bg-base-300/60 px-2.5 py-1.5 rounded-lg text-primary border border-base-content/10 mt-1">
              {{ deflationExample }}
            </div>
          </div>
        </div>

        <!-- Tab 2: Retirement Horizon -->
        <div
          v-if="activeTab === 'retirement'"
          class="flex flex-col gap-3"
        >
          <div class="bg-base-200/50 rounded-xl p-4 border border-base-content/10 shadow-sm flex flex-col gap-3">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <!-- Years to Contribute -->
              <div class="form-control w-full">
                <label class="label py-1">
                  <span class="label-text font-semibold text-xs sm:text-sm text-base-content">
                    Years to Accumulate / Save
                  </span>
                </label>
                <div class="relative">
                  <input
                    :id="`${constants.OPTIONS_FORM_ID}-years-to-contribute`"
                    v-model.number="state.yearsToContribute"
                    type="number"
                    step="1"
                    min="1"
                    class="input input-bordered input-sm w-full pr-10 font-mono text-sm bg-base-100/80"
                  >
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-base-content/60 pointer-events-none select-none uppercase font-semibold">
                    yrs
                  </span>
                </div>
                <span class="text-[11px] text-base-content/60 mt-1">Duration of active saving phase</span>
              </div>

              <!-- Years to Spend -->
              <div class="form-control w-full">
                <label class="label py-1">
                  <span class="label-text font-semibold text-xs sm:text-sm text-base-content">
                    Years to Spend / Draw Down
                  </span>
                </label>
                <div class="relative">
                  <input
                    :id="`${constants.OPTIONS_FORM_ID}-years-to-spend`"
                    v-model.number="state.yearsToSpend"
                    type="number"
                    step="1"
                    min="1"
                    class="input input-bordered input-sm w-full pr-10 font-mono text-sm bg-base-100/80"
                  >
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-base-content/60 pointer-events-none select-none uppercase font-semibold">
                    yrs
                  </span>
                </div>
                <span class="text-[11px] text-base-content/60 mt-1">Duration of retirement spending</span>
              </div>

              <!-- Desired Net Income -->
              <div class="form-control w-full">
                <label class="label py-1">
                  <span class="label-text font-semibold text-xs sm:text-sm text-base-content">
                    Target Monthly Net Income
                  </span>
                </label>
                <div class="relative">
                  <span class="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-base-content/60 pointer-events-none select-none">
                    {{ globalOptions.CurrencySymbol(globalOptions.currency, globalOptions.language) }}
                  </span>
                  <input
                    :id="`${constants.OPTIONS_FORM_ID}-desired-net-income`"
                    v-model.number="state.desiredNetIncome"
                    type="number"
                    step="100"
                    min="0"
                    class="input input-bordered input-sm w-full pl-7 font-mono text-sm bg-base-100/80"
                  >
                </div>
                <span class="text-[11px] text-base-content/60 mt-1">After-tax monthly goal in retirement</span>
              </div>

              <!-- Retirement Tax Rate -->
              <div class="form-control w-full">
                <label class="label py-1">
                  <span class="label-text font-semibold text-xs sm:text-sm text-base-content">
                    Estimated Retirement Tax Rate
                  </span>
                </label>
                <div class="relative">
                  <input
                    :id="`${constants.OPTIONS_FORM_ID}-retirement-tax-rate`"
                    v-model.number="state.retirementTaxRate"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    class="input input-bordered input-sm w-full pr-8 font-mono text-sm bg-base-100/80"
                  >
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-base-content/60 pointer-events-none select-none font-semibold">%</span>
                </div>
                <span class="text-[11px] text-base-content/60 mt-1">Effective tax rate on withdrawals</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 3: Display & Regional -->
        <div
          v-if="activeTab === 'display'"
          class="flex flex-col gap-3"
        >
          <global-options-formlet />
        </div>

        <!-- Tab 4: Data & Storage -->
        <div
          v-if="activeTab === 'storage'"
          class="flex flex-col gap-3"
        >
          <div class="bg-base-200/50 rounded-xl p-4 border border-base-content/10 shadow-sm flex flex-col gap-3">
            <div>
              <span class="font-bold text-sm text-base-content">Browser Local Storage & State</span>
              <p class="text-xs text-base-content/70 mt-1">
                Save your investment plan to this browser, reload saved data, or copy a snapshot to your clipboard.
              </p>
            </div>
            <div class="flex flex-wrap gap-2 pt-1">
              <base-button
                class="btn-xs sm:btn-sm btn-outline"
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
                class="btn-xs sm:btn-sm btn-ghost border border-base-content/20"
                @click="copyStateToClipboard"
              >
                {{ constants.BTN_COPY }}
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
                  Generate compressed URL links, download workspace backup JSON, or export accumulation tables.
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
