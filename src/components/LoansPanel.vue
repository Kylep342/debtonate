<script setup>
import LoanCard from './LoanCard.vue';

const props = defineProps(['loans', 'totalsAsALoan']);
</script>

<template>
  <div :class="['panel']">
    <ul :class="['cardHolder']">
      <li v-if='props.loans.length' :class="['card']">
        <LoanCard
          :loan='props.totalsAsALoan'
        />
      </li>
      <li
        v-for='(loan, index) in props.loans'
        :key='loan.id'
        :class="['card']"
      >
        <LoanCard
          :index='index + 1'
          :loan='loan'
        />
      </li>
    </ul>
  </div>
</template>
