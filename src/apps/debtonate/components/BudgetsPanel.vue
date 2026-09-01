<script setup lang="ts">
import { computed, reactive, ComputedRef, Reactive } from 'vue';

import BudgetCard from '@/apps/debtonate/components/BudgetCard.vue';
import constants from '@/apps/debtonate/constants/constants';
import { useDebtonateCoreStore, DebtonateCoreStore } from '@/apps/debtonate/stores/core';
import ListPanel from '@/apps/shared/components/ListPanel.vue';
import { usePivot } from '@/apps/shared/composables/usePivot';
import { Button, Menu } from '@/apps/shared/types/app';
import { MonthlyBudget } from '@/apps/shared/types/core';
import { Ref } from 'vue';

defineProps<{
  activeTab?: Ref<string>;
}>();

const state: DebtonateCoreStore = useDebtonateCoreStore();

const {
  viewedItemId: viewedLoanId,
  setViewedItemId: setViewedLoanId
} = usePivot(constants.TOTALS);

const loanSelectors: ComputedRef<Button[]> = computed(
  () => (state.loansWithTotals.map((l: any) => ({
    text: state.getLoanName(l.id),
    onClick: () => setViewedLoanId(l.id),
  })))
);

const pivotMenu: Reactive<Menu> = reactive({
  text: constants.BTN_PIVOT,
  buttons: loanSelectors,
  classes: ['btn-sm']
});

const defaultBudgetIndex: ComputedRef<number> = computed(
  () => state.monthlyBudgets.findIndex((budget: MonthlyBudget) => budget.id === constants.DEFAULT)
);

const orderedBudgets: ComputedRef<MonthlyBudget[]> = computed(() => [
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
    :active-tab="activeTab"
  >
    <template #item="{ item }">
      <BudgetCard
        :budget="item"
        :viewed-loan-id="viewedLoanId || constants.TOTALS"
      />
    </template>
  </ListPanel>
</template>
