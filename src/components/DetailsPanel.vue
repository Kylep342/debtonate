<script>
import AmortizationTable from './AmortizationTable.vue';

export default {
    props: ["loan", "index", "monthlyBudgets", "loanPaymentSummaries", "exit"],
    components: { AmortizationTable }
}
</script>

<template>
  <div id="loanDetailsPanel" class="modalFrame">
    <div :class="['modal']">
      <div :class="['cardHeader', 'header']">
        <h2 :class="['cardHeaderTitle']">Loan Details - Loan {{ this.index }}</h2>
        <div :class="['cardHeaderButtonContainer']">
            <button :class="['exitButton', 'bold']" @click="this.exit">x</button>
        </div>
      </div>
      <div :class="['verticalScroll']">
        <ul>
          <li v-for="budget in this.monthlyBudgets" :key="this.loan.id + budget.id">
            <AmortizationTable :loan="this.loan" :index="this.index" :budget="budget" :paymentSummary="this.loanPaymentSummaries[budget.id]" />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>