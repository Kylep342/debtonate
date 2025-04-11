<script setup lang="ts">
import { Button } from '@/apps/shared/types/app';
import { usePivot } from '@/apps/shared/composables/usePivot';
import { useResize } from '@/apps/shared/composables/useResize';
import constants from '@/apps/debtonate/constants/constants';
import LoanCard from '@/apps/debtonate/components/LoanCard.vue';
import ManagementPanel from '@/apps/shared/components/ManagementPanel.vue';
import useDebtonateCoreStore from '@/apps/debtonate/stores/core';

const state = useDebtonateCoreStore();

const {
  viewedItemId: viewedBudgetId,
  isViewedItemId: isViewedBudgetId,
  setViewedItemId: setViewedBudgetId
} = usePivot(constants.DEFAULT);

const { scrollContainer } = useResize('resizeLoansPanel');

const buttons: Array<Button> = [
  {
    text: constants.BTN_CREATE,
    onClick: state.openLoanForm,
    classes: ['btn-success', 'text-center'],
  },
];
</script>

<template>
  <base-card :id="'loanManagementPanel'" :class="['bg-base-100', 'w-90', 'flex-none']">
    <template #cardTitle>
      <ManagementPanel :buttons="buttons" :title="constants.LOANS" :class="['sticky', 'fixed', 'border-b-2']" />
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
          <li v-for="(loan) in state.loansWithTotals" :key="loan.id">
            <LoanCard :loan="loan" :viewedBudgetId="viewedBudgetId" />
          </li>
        </ul>
      </div>
    </template>
  </base-card>
</template>
