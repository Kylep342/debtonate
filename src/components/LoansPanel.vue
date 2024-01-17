<script>
import LoanCard from './LoanCard.vue';

export default {
  props: [
    'deleteLoan',
    'editLoan',
    'loans',
    'totalsAsALoan',
    'viewLoan',
  ],
  components: { LoanCard },
};
</script>

<template>
  <div :class="['panel']">
    <ul :class="['cardHolder']">
      <li v-if='this.loans.length' :class="['card']">
        <LoanCard
          :loan='totalsAsALoan'
          :viewLoan='this.viewLoan'
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
