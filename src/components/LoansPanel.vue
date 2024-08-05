<script setup>
import LoanCard from './LoanCard.vue';
import ManagementPanel from './ManagementPanel.vue';
import constants from '../constants/constants';

const props = defineProps(['createFunction', 'loans', 'totalsAsALoan']);
</script>

<template>
  <base-card :class="['bg-base-100', 'w-90']" :id="'loanManagementPanel'">
    <template #cardTitle>
      <ManagementPanel :createFunction="createFunction" :title="constants.LOANS"
        :class="['sticky', 'fixed', 'border-b-2']" />
    </template>
    <template #cardBody>
      <div :class="[
        'border-r-2',
        'h-screen',
        'overflow-y-auto',
        'overscroll-y-contain',
      ]">
        <div v-if="loans.length">
          <LoanCard :loan="props.totalsAsALoan" />
        </div>
        <ul>
          <li v-for="(loan) in props.loans" :key="loan.id">
            <LoanCard :loan="loan" />
          </li>
        </ul>
      </div>
    </template>
  </base-card>
</template>
