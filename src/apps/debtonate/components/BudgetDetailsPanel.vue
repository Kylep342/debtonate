<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import AmortizationTable from '@/apps/debtonate/components/AmortizationTable.vue';
import { usePivot } from '@/apps/shared/composables/usePivot';
import constants from '@/apps/debtonate/constants/constants';
import useCoreStore from '@/apps/debtonate/stores/core';
import { MonthlyBudget } from '@/apps/shared/types/core';

const coreState = useCoreStore();
const currentBudget = ref<MonthlyBudget>();

const { viewedItemId, isViewedItemId, setViewedItemId } = usePivot(constants.TOTALS);

const buildBudgetDetailsTitle = (monthlyBudget: MonthlyBudget): string => monthlyBudget
  ? `Budget Details - ${coreState.getBudgetName(monthlyBudget.id)} | `
  + `${coreState.Money(monthlyBudget.absolute)}/month `
  + `(+${coreState.Money(monthlyBudget.relative)}/month)`
  : constants.BUDGET_DETAILS;

const title = computed<string>(() => (buildBudgetDetailsTitle(currentBudget.value!)))

watch(
  () => coreState.currentBudgetId,
  (newId) => {
    if (newId && coreState.budgetDetailsPanelActive) {
      currentBudget.value = coreState.getBudget(newId);
    }
  },
  { immediate: true },
);
</script>

<template>
  <base-modal :id="constants.BUDGET_DETAILS_ID" @exit="coreState.unviewBudget">
    <template #header>
      <h2>{{ title }}</h2>
    </template>
    <template #headerActions>
      <base-button :class="['btn btn-circle btn-ghost']" @click="coreState.unviewBudget">
        x
      </base-button>
    </template>
    <template #body>
      <div v-if="currentBudget" :class="['tabframe', 'w-auto']">
        <base-tabs :get-item-name="coreState.getLoanName" :pivot="coreState.loansWithTotals"
          :is-viewed-item-id="isViewedItemId" :set-viewed-item-id="setViewedItemId">
          <template #tabContent>
            <AmortizationTable :payment-schedule="coreState.getPaymentSchedule(viewedItemId, currentBudget.id)" :title="coreState.buildAmortizationTableTitle(
              coreState.getLoan(viewedItemId),
              currentBudget,
            )" :subtitle="coreState.buildAmortizationTableSubtitle(
                coreState.getLoan(viewedItemId),
                currentBudget,
              )" />
          </template>
        </base-tabs>
      </div>
    </template>
  </base-modal>
</template>
