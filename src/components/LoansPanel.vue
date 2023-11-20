<script>
import LoanCard from './LoanCard.vue';
import TotalsCard from './TotalsCard.vue';

export default {
  props: [
    'deleteLoan',
    'editLoan',
    'effectiveInterestRate',
    'globalMinPayment',
    'loans',
    'viewLoan',
    'totalPrincipal',
  ],
  components: { LoanCard, TotalsCard },
};
</script>

<template>
  <div :class="['panel']">
    <ul :class="['cardHolder']">
      <li v-if='this.loans.length' :class="['card']">
        <TotalsCard
          :effectiveRate='this.effectiveInterestRate'
          :minimumPayment='this.globalMinPayment'
          :principal='this.totalPrincipal'
        />
      </li>
      <li v-for='(loan, index) in this.loans' :key='loan.id' :class="['card']">
        <LoanCard
          :deleteLoan='this.deleteLoan'
          :editLoan='this.editLoan'
          :index='index + 1'
          :loan='loan'
          :viewLoan='this.viewLoan'
        />
      </li>
    </ul>
  </div>
</template>
