<script>
import AmortizationTable from './AmortizationTable.vue';
import DataChart from './DataChart.vue';

export default {
  props: ['loan', 'index', 'monthlyBudgets', 'loanPaymentSummaries', 'loanAmortizationSchedulesChart', 'exit'],
  components: { AmortizationTable, DataChart },
};
</script>

<template>
  <div id="loanDetailsPanel" class="modalFrame">
    <div :class="['modal']">
      <div :class="['cardHeader', 'header']">
        <h2 :class="['cardHeaderTitle']">Loan Details - Loan {{ this.index }}
          (${{ loan.principal.toFixed(2) }}
          @ {{ (loan.annualRate * 100).toFixed(2) }}%)</h2>
        <div :class="['cardHeaderButtonContainer']">
            <button :class="['exitButton', 'bold']" @click="this.exit">x</button>
        </div>
      </div>
      <div :class="['verticalScroll']">
        <ul>
          <li v-for="budget in this.monthlyBudgets" :key="this.loan.id + budget.id">
            <AmortizationTable
              :loan="this.loan"
              :index="this.index"
              :budget="budget"
              :paymentSummary="this.loanPaymentSummaries[budget.id]"
            />
         </li>
        </ul>
        <DataChart
          :id="'amortizationChart' + loan.id"
          :chart="this.loanAmortizationSchedulesChart"
        />
      </div>
    </div>
  </div>
</template>
