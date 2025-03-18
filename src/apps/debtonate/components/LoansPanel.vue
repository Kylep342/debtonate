<script setup lang="ts">
import LoanCard from '@/apps/debtonate/components/LoanCard.vue';
import ManagementPanel from '@/apps/debtonate/components/ManagementPanel.vue';
import { useResize } from '@/apps/shared/composables/useResize';
import constants from '@/apps/debtonate/constants/constants';
import useCoreStore from '@/apps/debtonate/stores/core';
import { Button } from '@/apps/shared/types/app';

const coreState = useCoreStore();

const { scrollContainer } = useResize('resizeLoansPanel');

const buttons: Array<Button> = [
  {
    text: constants.BTN_CREATE,
    onClick: coreState.openLoanForm,
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
          <li v-for="(loan) in coreState.loansWithTotals" :key="loan.id">
            <LoanCard :loan="loan" />
          </li>
        </ul>
      </div>
    </template>
  </base-card>
</template>
