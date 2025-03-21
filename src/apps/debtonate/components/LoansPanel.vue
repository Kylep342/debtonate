<script setup lang="ts">
import LoanCard from '@/apps/debtonate/components/LoanCard.vue';
import constants from '@/apps/debtonate/constants/constants';
import useDebtonateCoreStore from '@/apps/debtonate/stores/core';
import ManagementPanel from '@/apps/shared/components/ManagementPanel.vue';
import { useResize } from '@/apps/shared/composables/useResize';
import sharedConstants from '@/apps/shared/constants/constants';
import { Button } from '@/apps/shared/types/app';

const state = useDebtonateCoreStore();

const { scrollContainer } = useResize('resizeLoansPanel');

const buttons: Array<Button> = [
  {
    text: sharedConstants.BTN_CREATE,
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
            <LoanCard :loan="loan" />
          </li>
        </ul>
      </div>
    </template>
  </base-card>
</template>
