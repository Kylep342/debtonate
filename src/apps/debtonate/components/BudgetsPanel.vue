<script setup lang="ts">
import { computed, reactive } from 'vue';

import { Button, Menu } from '@/apps/shared/types/app';
import { MonthlyBudget } from '@/apps/shared/types/core';
import { usePivot } from '@/apps/shared/composables/usePivot';
import { useResize } from '@/apps/shared/composables/useResize';
import BudgetCard from '@/apps/debtonate/components/BudgetCard.vue';
import constants from '@/apps/shared/constants/constants';
import ManagementPanel from '@/apps/shared/components/ManagementPanel.vue';
import useDebtonateCoreStore from '@/apps/debtonate/stores/core';

const state = useDebtonateCoreStore();

const {
  viewedItemId: viewedLoanId,
  isViewedItemId: isViewedLoanId,
  setViewedItemId: setViewedLoanId
} = usePivot(constants.TOTALS);

const { scrollContainer } = useResize('resizeBudgetsPanel');

const loanSelectors = computed<Array<Button>>(
  () => (state.loansWithTotals.map((loan) => ({
    text: state.getLoanName(loan.id),
    onClick: () => setViewedLoanId(loan.id),
  })))
);

const button = <Button>{
  text: constants.BTN_CREATE,
  onClick: state.openBudgetForm,
  classes: ['btn-success', 'text-center'],
};

const menu = reactive<Menu>({
  text: constants.BTN_PIVOT,
  buttons: loanSelectors,
});

const defaultBudgetIndex = computed<number>(
  () => state.monthlyBudgets.findIndex((budget) => budget.id === constants.DEFAULT)
);

const orderedBudgets = computed<MonthlyBudget[]>(() => [
  state.monthlyBudgets[defaultBudgetIndex.value],
  ...state.monthlyBudgets.slice(0, defaultBudgetIndex.value),
  ...state.monthlyBudgets.slice(defaultBudgetIndex.value + 1),
]);
</script>

<template>
  <base-card :id="'budgetManagementPanel'" :class="['bg-base-100', 'w-90', 'flex-none']">
    <template #cardTitle>
      <ManagementPanel :button="button" :menu="menu" :title="constants.BUDGETS" :class="['sticky', 'fixed', 'border-b-2']" />
    </template>
    <template #cardBody>
      <div ref="scrollContainer" :class="[
        'border-r-2',
        'overflow-y-auto',
        'flex',
        'flex-col',
        'min-h-0'
      ]">
        <ul>
          <li v-for="(budget) in orderedBudgets" :key="budget.id">
            <BudgetCard :budget="budget" :viewedLoanId="viewedLoanId"/>
          </li>
        </ul>
      </div>
    </template>
  </base-card>
</template>
