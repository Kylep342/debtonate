<script setup>
import LoanCard from './LoanCard.vue';
import ManagementPanel from './ManagementPanel.vue';

const props = defineProps([
  'createFunction',
  'loans',
  'totalsAsALoan',
]);
const title = 'Loans';
</script>

<template>
  <base-card
    :class="['bg-base-100', 'h-screen', 'w-90']"
    :id="'loanManagementPanel'"
  >
    <template #cardTitle>
      <ManagementPanel
        :createFunction='createFunction'
        :title='title'
      />
    </template>
    <template
      #cardBody
    >
      <div>
        <div v-if='loans.length'>
          <LoanCard :loan='props.totalsAsALoan' />
        </div>
        <div v-for='(loan, index) in props.loans' :key='loan.id'>
          <LoanCard :index='index + 1' :loan='loan' />
        </div>
      </div>
    </template>
  </base-card>
</template>
