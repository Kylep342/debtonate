<script setup>
import LoanCard from './LoanCard.vue';
import ManagementPanel from './ManagementPanel.vue';

const props = defineProps(['createFunction', 'loans', 'totalsAsALoan']);
const title = 'Loans';
</script>

<template>
  <base-card
    :class="['bg-base-100', 'w-90']"
    :id="'loanManagementPanel'"
  >
    <template #cardTitle>
      <ManagementPanel
        :createFunction="createFunction"
        :title="title"
        :class="['sticky', 'fixed', 'border-b-2']"
      />
    </template>
    <template #cardBody>
      <div
        :class="[
          'h-screen',
          'overflow-y-auto',
          'overscroll-y-contain',
          'border-r-2'
        ]">
        <div v-if="loans.length">
          <LoanCard :loan="props.totalsAsALoan" />
        </div>
        <ul>
          <li v-for="(loan, index) in props.loans" :key="loan.id">
            <LoanCard :index="index + 1" :loan="loan" />
          </li>
        </ul>
      </div>
    </template>
  </base-card>
</template>
