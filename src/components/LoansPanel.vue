<script setup>
import {
  ref,
  onBeforeUnmount,
  onMounted,
  onUpdated,
} from 'vue';

import LoanCard from './LoanCard.vue';
import ManagementPanel from './ManagementPanel.vue';
import constants from '../constants/constants';
import { fillHeight } from '../functions/viewport';
import useCoreStore from '../stores/core';

const coreState = useCoreStore();

const scrollContainer = ref(null);

const buttons = [
  {
    text: constants.BTN_CREATE,
    onClick: coreState.openLoanForm,
    classes: ['btn-success', 'text-center'],
  },
]

onMounted(() => {
  scrollContainer.value.style.maxHeight = `${fillHeight(scrollContainer, 26)}px`;
  window.addEventListener('resizeLoansPanel', fillHeight);
});

onUpdated(() => {
  scrollContainer.value.style.maxHeight = `${fillHeight(scrollContainer, 26)}px`;
});

onBeforeUnmount(() => {
  window.removeEventListener('resizeLoansPanel', fillHeight);
});
</script>

<template>
  <base-card
    :id="'loanManagementPanel'"
    :class="['bg-base-100', 'w-90', 'flex-none']"
  >
    <template #cardTitle>
      <ManagementPanel
        :buttons="buttons"
        :title="constants.LOANS"
        :class="['sticky', 'fixed', 'border-b-2']"
      />
    </template>
    <template #cardBody>
      <div
        ref="scrollContainer"
        :class="[
          'border-r-2',
          'overflow-y-auto',
          'flex',
          'flex-col',
          'min-h-0'
        ]"
      >
        <ul>
          <li
            v-for="(loan) in coreState.loansWithTotals"
            :key="loan.id"
          >
            <LoanCard :loan="loan" />
          </li>
        </ul>
      </div>
    </template>
  </base-card>
</template>
