<script setup lang="ts">
import { loan, paymentTypes } from 'moneyfunx';
import { computed, ref, watch, ComputedRef, Ref } from 'vue';

import constants from '@/apps/debtonate/constants/constants';
import { useDebtonateCoreStore, DebtonateCoreStore } from '@/apps/debtonate/stores/core';
import { usePivot } from '@/apps/shared/composables/usePivot';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { MonthlyBudget } from '@/apps/shared/types/core';
import { UIDebtLoan } from '@/apps/debtonate/types/core';

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
const state: DebtonateCoreStore = useDebtonateCoreStore();

const currentBudget: Ref<MonthlyBudget|null> = ref(null);

const { viewedItemId, isViewedItemId, setViewedItemId } = usePivot(constants.TOTALS);

const currentLoan: ComputedRef<loan.ILoan | UIDebtLoan | null> = computed(() => {
  if (!viewedItemId.value) return null;
  return state.getLoan(viewedItemId.value) || null;
});

const paymentSchedule: ComputedRef<paymentTypes.PaymentSchedule> = computed(() => {
  if (!currentBudget.value || !viewedItemId.value) {
    return {
      lifetimeInterest: 0n,
      lifetimePrincipal: 0n,
      amortizationSchedule: [],
    };
  }
  return state.getPaymentSchedule(viewedItemId.value, currentBudget.value.id);
});

const amortizationTitle: ComputedRef<string> = computed(() => {
  if (!currentLoan.value || !currentBudget.value) return '';
  return state.buildAmortizationTableTitle(currentLoan.value, currentBudget.value);
});

const amortizationSubtitle: ComputedRef<string> = computed(() => {
  if (!currentLoan.value || !currentBudget.value) return '';
  return state.buildAmortizationTableSubtitle(currentLoan.value, currentBudget.value);
});

const tableRows: ComputedRef<{}[]> = computed(() => {
  if (!paymentSchedule.value) return [];
  return state.amortizationTableRows(paymentSchedule.value);
});

const tableFooter: ComputedRef<{}> = computed(() => {
  if (!paymentSchedule.value) return {};
  return state.amortizationTableTotals(paymentSchedule.value);
})

const buildBudgetDetailsTitle = (monthlyBudget: MonthlyBudget): string => monthlyBudget
  ? `Budget Details - ${state.getBudgetName(monthlyBudget.id)} | `
  + `${globalOptions.Money(monthlyBudget.absolute)}/month `
  + `(+${globalOptions.Money(monthlyBudget.relative)} over minimum)`
  : constants.BUDGET_DETAILS;

const title: ComputedRef<string> = computed(() => (buildBudgetDetailsTitle(currentBudget.value!)))

watch(
  () => state.currentBudgetId,
  (newId) => {
    if (newId && state.budgetDetailsPanelActive) {
      currentBudget.value = state.getBudget(newId)!;
    }
  },
  { immediate: true },
);
</script>

<template>
  <base-modal
    :id="constants.BUDGET_DETAILS_ID"
    :max-width="'4xl'"
    @exit="state.unviewBudget"
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
        @click="state.unviewBudget"
      >
        x
      </base-button>
    </template>
    <template #body>
      <div
        v-if="currentBudget"
        class="p-3 sm:p-4 flex flex-col gap-4"
      >
        <!-- Top Stat Ribbon -->
        <div class="bg-base-200/50 rounded-xl p-3.5 border border-base-content/10 shadow-sm grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <span class="text-base-content/60 text-[11px] block">Monthly Budget</span>
            <span class="font-mono font-bold text-sm sm:text-base text-base-content">
              {{ globalOptions.Money(currentBudget.absolute) }}/mo
            </span>
          </div>
          <div>
            <span class="text-base-content/60 text-[11px] block">Over Minimum</span>
            <span class="font-mono font-bold text-sm sm:text-base text-success">
              +{{ globalOptions.Money(currentBudget.relative) }}/mo
            </span>
          </div>
          <div>
            <span class="text-base-content/60 text-[11px] block">Baseline Minimum</span>
            <span class="font-mono font-bold text-sm sm:text-base text-base-content">
              {{ globalOptions.Money(state.totalMinPayment) }}/mo
            </span>
          </div>
        </div>

        <!-- Amortization Schedules Pivot -->
        <div class="tabframe w-auto">
          <base-tabs
            :get-item-name="state.getLoanName"
            :pivot="state.loansWithTotals"
            :is-viewed-item-id="isViewedItemId"
            :set-viewed-item-id="setViewedItemId"
          >
            <template #tabContent>
              <data-table
                :title="amortizationTitle"
                :subtitle="amortizationSubtitle"
                :headers="state.amortizationTableHeaders"
                :rows="tableRows"
                :totals="tableFooter"
              />
            </template>
          </base-tabs>
        </div>
      </div>
    </template>
    <template #actions>
      <div class="flex items-center justify-end w-full">
        <base-button
          class="btn-sm btn-primary"
          @click="state.unviewBudget"
        >
          Done
        </base-button>
      </div>
    </template>
  </base-modal>
</template>
