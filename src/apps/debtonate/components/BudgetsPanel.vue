<script setup lang="ts">
import { computed, reactive } from 'vue';

import BudgetCard from '@/apps/debtonate/components/BudgetCard.vue';
import useDebtonateCoreStore from '@/apps/debtonate/stores/core';
import ListPanel from '@/apps/shared/components/ListPanel.vue';
import { usePivot } from '@/apps/shared/composables/usePivot';
import constants from '@/apps/shared/constants/constants';
import { Button, Menu } from '@/apps/shared/types/app';
import { MonthlyBudget } from '@/apps/shared/types/core';

const state = useDebtonateCoreStore();

const {
  viewedItemId: viewedLoanId,
  setViewedItemId: setViewedLoanId
} = usePivot(constants.TOTALS);

const loanSelectors = computed<Array<Button>>(
  () => (state.loansWithTotals.map((loan) => ({
    text: state.getLoanName(loan.id),
    onClick: () => setViewedLoanId(loan.id),
  })))
);

const pivotMenu = reactive<Menu>({
  text: constants.BTN_PIVOT,
  buttons: loanSelectors,
});

const defaultBudgetIndex = computed<number>(
  () => state.monthlyBudgets.findIndex((budget) => budget.id === constants.DEFAULT)
);

const orderedBudgets = computed<Array<MonthlyBudget>>(() => [
  state.monthlyBudgets[defaultBudgetIndex.value],
  ...state.monthlyBudgets.slice(0, defaultBudgetIndex.value),
  ...state.monthlyBudgets.slice(defaultBudgetIndex.value + 1),
]);
</script>

<template>
  <ListPanel
    panel-id="budgetManagementPanel"
    :title="constants.BUDGETS"
    :items="orderedBudgets"
    :create-item="state.openBudgetForm"
    :pivot-menu="pivotMenu"
    :create-text="constants.BTN_CREATE"
  >
    <template #item="{ item }">
      <BudgetCard
        :budget="item"
        :viewed-loan-id="viewedLoanId"
      />
    </template>
  </ListPanel>
</template>
