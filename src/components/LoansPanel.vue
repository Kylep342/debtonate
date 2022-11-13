<script>
import LoanCard from './LoanCard.vue';

export default {
  props: ['deleteLoan', 'editLoan', 'loans', 'viewLoan'],
  components: { LoanCard },
};
</script>

<template>
  <div id="LoansPanel" v-show="this.loans.length">
    <ul class="cardHolder">
      <li v-for="(loan, index) in this.loans" :key="loan.id" class="card">
        <LoanCard
          :deleteLoan="this.deleteLoan"
          :editLoan="this.editLoan"
          :loan="loan"
          :index="index + 1"
          :viewLoan="this.viewLoan"
        />
      </li>
    </ul>
  </div>
</template>
