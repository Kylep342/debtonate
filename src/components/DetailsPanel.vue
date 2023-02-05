<script>
import AmortizationTable from './AmortizationTable.vue';
import DataChart from './Chart.vue';

export default {
  props: [
    'loan',
    'index',
    'monthlyBudgets',
    'loanPaymentSummaries',
    'loanAmortizationSchedulesChart',
  ],
  emits: ['exit-details-panel'],
  components: { AmortizationTable, DataChart },
  computed: {
    cardTitle() {
      return (`Loan Details - Loan ${this.index} `
        + `($${this.loan.principal.toFixed(2)} `
        + `@ ${(this.loan.annualRate * 100).toFixed(2)}%)`
      );
    },
  },
  methods: {
    emitExit() {
      this.$emit('exit-details-panel');
    },
  },
};
</script>

<template>
  <div id="loanDetailsPanel" class="modalFrame">
    <div :class="['modal']">
      <div :class="['cardHeader', 'header']">
        <h2 :class="['cardHeaderTitle']">{{ cardTitle }}</h2>
        <div :class="['cardHeaderButtonContainer']">
            <button :class="['exitButton', 'bold']" @click="this.emitExit">x</button>
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
