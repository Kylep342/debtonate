<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { MonthlyBudget } from '@/apps/shared/types/core';
import { usePivot } from '@/apps/shared/composables/usePivot';
import AmortizationTable from '@/apps/debtonate/components/AmortizationTable.vue';
import constants from '@/apps/debtonate/constants/constants';
import useDebtonateCoreStore from '@/apps/debtonate/stores/core';
import useGlobalOptionsStore from '@/apps/shared/stores/globalOptions';

const globalOptions = useGlobalOptionsStore();
const state = useDebtonateCoreStore();

const currentBudget = ref<MonthlyBudget>();

const { viewedItemId, isViewedItemId, setViewedItemId } = usePivot(constants.TOTALS);

const buildBudgetDetailsTitle = (monthlyBudget: MonthlyBudget): string => monthlyBudget
  ? `Budget Details - ${state.getBudgetName(monthlyBudget.id)} | `
  + `${globalOptions.Money(monthlyBudget.absolute)}/month `
  + `(+${globalOptions.Money(monthlyBudget.relative)}/month)`
  : constants.BUDGET_DETAILS;

const title = computed<string>(() => (buildBudgetDetailsTitle(currentBudget.value!)))

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
  <base-modal @exit="state.unviewBudget">
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
        <base-tabs :get-item-name="state.getLoanName" :pivot="state.loansWithTotals"
          :is-viewed-item-id="isViewedItemId" :set-viewed-item-id="setViewedItemId">
          <template #tabContent>
            <AmortizationTable :payment-schedule="state.getPaymentSchedule(viewedItemId, currentBudget.id)" :title="state.buildAmortizationTableTitle(
              state.getLoan(viewedItemId),
              currentBudget,
            )" :subtitle="state.buildAmortizationTableSubtitle(
                state.getLoan(viewedItemId),
                currentBudget,
              )" />
          </template>
        </base-tabs>
      </div>
    </template>
  </base-modal>
</template>
