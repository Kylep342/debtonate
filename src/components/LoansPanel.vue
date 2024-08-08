<script setup>
import { inject, ref } from 'vue';

import LoanCard from './LoanCard.vue';
import ManagementPanel from './ManagementPanel.vue';
import constants from '../constants/constants';

const props = defineProps(['createFunction']);

const loanPrimitives = inject('loanPrimitives');
const loans = ref(loanPrimitives.loansWithTotals);
</script>

<template>
  <base-card :class="['bg-base-100', 'w-90']" :id="'loanManagementPanel'">
    <template #cardTitle>
      <ManagementPanel :createFunction="props.createFunction" :title="constants.LOANS"
        :class="['sticky', 'fixed', 'border-b-2']" />
    </template>
    <template #cardBody>
      <div :class="[
        'border-r-2',
        'h-screen',
        'overflow-y-auto',
        'overscroll-y-contain',
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
