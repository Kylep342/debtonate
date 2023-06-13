<script>
import LoanCard from "./LoanCard.vue";
import TotalsCard from "./TotalsCard.vue";

export default {
  props: [
    "deleteLoan",
    "editLoan",
    "loans",
    "viewLoan",
    "totalPrincipal",
    "effectiveInterestRate",
    "globalMinPayment",
  ],
  components: { LoanCard, TotalsCard },
};
</script>

<template>
  <div :class="['panel']">
    <ul :class="['cardHolder']">
      <li :class="['card']">
        <TotalsCard
          v-show="this.loans.length"
          :principal="this.totalPrincipal"
          :effectiveRate="this.effectiveInterestRate"
          :minimumPayment="this.globalMinPayment"
        />
      </li>
      <li v-for="(loan, index) in this.loans" :key="loan.id" :class="['card']">
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
