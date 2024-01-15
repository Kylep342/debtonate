<script>
import AmortizationTable from './AmortizationTable.vue';
import * as constants from '../constants/constants';

export default {
  props: [
    'index',
    'amortizationSchedulesChart',
    'paymentSummaries',
    'monthlyBudgets',
    'loan',
    'type',
  ],
  emits: ['exit-details-panel'],
  components: { AmortizationTable },
  computed: {
    cardTitle() {
      return (
        `${this.type} Details - ${this.type} ${this.index} `
        + `($${this.loan.principal.toFixed(2)} `
        + `@ ${(this.loan.annualRate * 100).toFixed(2)}%)`
      );
    },
  },
  methods: {
    buildTitle(loan, monthlyBudget) {
      return (
        `${loan.id === constants.TOTALS ? 'All Loans' : `Loan ${this.index}`} `
        + `($${loan.principal.toFixed(2)} `
        + `@ ${(loan.annualRate * 100).toFixed(2)}%) `
        + `Total Budget: $${monthlyBudget.absolute.toFixed(2)}/mo`
      );
    },
    emitExit() {
      this.$emit('exit-details-panel');
    },
    generateKey(loan, monthlyBudget) {
      return loan.id + monthlyBudget.id;
    },
  },
};
</script>

<template>
  <base-modal>
    <template #header>
      <h2>{{ cardTitle }}</h2>
    </template>
    <template #body>
      <div>
        <ul>
          <li
            v-for='budget in this.monthlyBudgets'
            :key='this.generateKey(this.loan, budget)'
          >
            <AmortizationTable
              :id="'amortizationTable' + this.generateKey(this.loan, budget)"
              :index='this.index'
              :keyPrefix='this.generateKey(this.loan, budget)'
              :paymentSummary='this.paymentSummaries[budget.id]'
              :title='this.buildTitle(this.loan, budget)'
            />
          </li>
        </ul>
        <base-chart
          :chart='this.amortizationSchedulesChart'
          :id="'amortizationChart' + loan.id"
        />
      </div>
    </template>
    <template #actions>
      <base-button :class="['createButton']" @click='emitExit'
        >Close</base-button
      >
    </template>
  </base-modal>
</template>
