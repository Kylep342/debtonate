<script setup lang="ts">
import { computed, reactive } from 'vue';

import LoanCard from '@/apps/debtonate/components/LoanCard.vue';
import useDebtonateCoreStore from '@/apps/debtonate/stores/core';
import ListPanel from '@/apps/shared/components/ListPanel.vue';
import { usePivot } from '@/apps/shared/composables/usePivot';
import constants from '@/apps/debtonate/constants/constants';
import { Button, Menu } from '@/apps/shared/types/app';

const state = useDebtonateCoreStore();

const {
  viewedItemId: viewedBudgetId,
  setViewedItemId: setViewedBudgetId
} = usePivot(constants.DEFAULT);

const budgetSelectors = computed<Button[]>(
  () => (state.monthlyBudgets.map((budget) => ({
    text: state.getBudgetName(budget.id),
    onClick: () => setViewedBudgetId(budget.id),
  })))
);

const pivotMenu = reactive<Menu>({
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
