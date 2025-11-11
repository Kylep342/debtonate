<script setup lang="ts">
import * as moneyfunx from 'moneyfunx';
import {
  computed,
  ref,
  watch,
  type ComputedRef,
  type Ref,
} from 'vue';

import constants from '@/apps/debtonate/constants/constants';
import { useDebtonateCoreStore, type DebtonateCoreStore }  from '@/apps/debtonate/stores/core';
import { usePivot } from '@/apps/shared/composables/usePivot';
import { useGlobalOptionsStore, type GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { MonthlyBudget } from '@/apps/shared/types/core';

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
const state: DebtonateCoreStore = useDebtonateCoreStore();

const currentBudget: Ref<MonthlyBudget|null> = ref(null);

const { viewedItemId, isViewedItemId, setViewedItemId } = usePivot(constants.TOTALS);

const currentLoan: ComputedRef<moneyfunx.ILoan> = computed(() => state.getLoan(viewedItemId.value));

const paymentSchedule: ComputedRef<moneyfunx.PaymentSchedule> = computed(() => {
  if (!currentBudget.value || !viewedItemId.value) return null;
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
  + `(+${globalOptions.Money(monthlyBudget.relative)}/month)`
  : constants.BUDGET_DETAILS;

const title: ComputedRef<string> = computed(() => (buildBudgetDetailsTitle(currentBudget.value!)))

watch(
  () => state.currentBudgetId,
  (newId) => {
    if (newId && state.budgetDetailsPanelActive) {
      currentBudget.value = state.getBudget(newId);
    }
  },
  { immediate: true },
);
</script>

<template>
  <base-modal :id="constants.BUDGET_DETAILS_ID" @exit="state.unviewBudget">
    <template #header>
      <h2>{{ title }}</h2>
    </template>
    <template #headerActions>
      <base-button :class="['btn btn-circle btn-ghost']" @click="state.unviewBudget">
        x
      </base-button>
    </template>
    <template #body>
      <div v-if="currentBudget" :class="['tabframe', 'w-auto']">
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
    </template>
  </base-modal>
</template>
