<script setup lang="ts">
import {
  computed,
  reactive,
  type ComputedRef,
  type Reactive
} from 'vue';

import LoanCard from '@/apps/debtonate/components/LoanCard.vue';
import constants from '@/apps/debtonate/constants/constants';
import { useDebtonateCoreStore, type DebtonateCoreStore }  from '@/apps/debtonate/stores/core';
import ListPanel from '@/apps/shared/components/ListPanel.vue';
import { usePivot } from '@/apps/shared/composables/usePivot';
import { Button, Menu } from '@/apps/shared/types/app';
import { MonthlyBudget } from '@/apps/shared/types/core';

const state: DebtonateCoreStore = useDebtonateCoreStore();

const {
  viewedItemId: viewedBudgetId,
  setViewedItemId: setViewedBudgetId
} = usePivot(constants.DEFAULT);

const budgetSelectors: ComputedRef<Button[]> = computed(
  () => (state.monthlyBudgets.map((budget: MonthlyBudget) => ({
    text: state.getBudgetName(budget.id),
    onClick: () => setViewedBudgetId(budget.id),
  })))
);

const pivotMenu: Reactive<Menu> = reactive({
  text: constants.BTN_PIVOT,
  buttons: budgetSelectors,
});
</script>

<template>
  <ListPanel
    panel-id="loanManagementPanel"
    :title="constants.LOANS"
    :items="state.loansWithTotals"
    :create-item="state.openLoanForm"
    :pivot-menu="pivotMenu"
    :create-text="constants.BTN_CREATE"
  >
    <template #item="{ item }">
      <LoanCard
        :loan="item"
        :viewed-budget-id="viewedBudgetId"
      />
    </template>
  </ListPanel>
</template>
