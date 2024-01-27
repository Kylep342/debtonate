<script setup>
import LoanCard from './LoanCard.vue';

const props = defineProps([
  'deleteLoan',
  'editLoan',
  'loans',
  'totalsAsALoan',
  'viewLoan',
]);
</script>

<template>
  <div :class="['panel']">
    <ul :class="['cardHolder']">
      <li v-if='props.loans.length' :class="['card']">
        <LoanCard
          :loan='props.totalsAsALoan'
          :viewLoan='props.viewLoan'
        />
      </li>
      <li
        v-for='(loan, index) in props.loans'
        :key='loan.id'
        :class="['card']"
      >
        <LoanCard
          :deleteLoan='props.deleteLoan'
          :editLoan='props.editLoan'
          :index='index + 1'
          :loan='loan'
          :viewLoan='props.viewLoan'
        />
      </li>
    </ul>
  </div>
</template>
