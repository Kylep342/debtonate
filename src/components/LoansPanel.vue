<script setup>
import {
  ref,
  onBeforeUnmount,
  onMounted,
} from 'vue';

import LoanCard from './LoanCard.vue';
import ManagementPanel from './ManagementPanel.vue';
import constants from '../constants/constants';
import { heightRestOfViewport } from '../functions/viewport';
import useCoreStore from '../stores/core';

const state = useCoreStore();

const scrollContainer = ref(null);

onMounted(() => {
  scrollContainer.value.style.maxHeight = `${heightRestOfViewport(scrollContainer, 26)}px`;
  window.addEventListener('resizeLoansPanel', heightRestOfViewport);
});

onBeforeUnmount(() => {
  window.removeEventListener('resizeLoansPanel', heightRestOfViewport);
});
</script>

<template>
  <base-card
    :id="'loanManagementPanel'"
    :class="['bg-base-100', 'w-90']"
  >
    <template #cardTitle>
      <ManagementPanel
        :create-function="state.openCreateBudgetForm"
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
            v-for="(loan) in state.loansWithTotals"
            :key="loan.id"
          >
            <LoanCard :loan="loan" />
          </li>
        </ul>
      </div>
    </template>
  </base-card>
</template>
