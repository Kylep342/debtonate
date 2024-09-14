<script setup>
import {
  inject,
  ref,
  onBeforeUnmount,
  onMounted,
} from 'vue';

import LoanCard from './LoanCard.vue';
import ManagementPanel from './ManagementPanel.vue';
import constants from '../constants/constants';
import { heightRestOfViewport } from '../functions/viewport';

const props = defineProps(['createFunction']);

const loanPrimitives = inject('loanPrimitives');
const loans = ref(loanPrimitives.loansWithTotals);
const scrollContainer = ref(null);

onMounted(() => {
  scrollContainer.value.style.maxHeight = `${heightRestOfViewport(scrollContainer)}px`;
  window.addEventListener('resizeLoansPanel', heightRestOfViewport); // Adjust on resize
});

onBeforeUnmount(() => {
  window.removeEventListener('resizeLoansPanel', heightRestOfViewport);
});
</script>

<template>
  <base-card :class="['bg-base-100', 'w-90']" :id="'loanManagementPanel'">
    <template #cardTitle>
      <ManagementPanel :createFunction="props.createFunction" :title="constants.LOANS"
        :class="['sticky', 'fixed', 'border-b-2']" />
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
          <li v-for="(loan) in loans" :key="loan.id">
            <LoanCard :loan="loan" />
          </li>
        </ul>
      </div>
    </template>
  </base-card>
</template>
