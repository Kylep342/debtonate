<script setup>
import LoanCard from './LoanCard.vue';
import ManagementPanel from './ManagementPanel.vue';

const props = defineProps(['createFunction', 'loans', 'totalsAsALoan']);
const title = 'Loans';
</script>

<template>
  <base-card :class="['bg-base-100']" :id="'loanManagementPanel'">
    <template #cardTitle>
      <ManagementPanel
        :createFunction='createFunction'
        :title='title'
      />
    </template>
    <template #cardContent>
      <ul v-if="loans.length">
        <li v-if='loans.length'>
          <LoanCard :loan='props.totalsAsALoan' />
        </li>
        <li v-for='(loan, index) in props.loans' :key='loan.id'>
          <LoanCard :index='index + 1' :loan='loan' />
        </li>
      </ul>
    </template>
  </base-card>
</template>
