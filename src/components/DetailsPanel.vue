<script>
import AmortizationTable from './AmortizationTable.vue';
import constants from '../constants/constants';

export default {
  props: [
    'index',
    'amortizationSchedulesChart',
    'loan',
    'monthlyBudgets',
    'paymentSummaries',
    'title',
    'type',
  ],
  emits: ['exit-details-panel'],
  data() {
    return {
      constants,
    };
  },
  components: { AmortizationTable },
  computed: {
    renderedBudgetAbsoluteAmount() {
      return this.monthlyBudgets[0].absolute.toFixed(2);
    },
    renderedBudgetRelativeAmount() {
      return this.monthlyBudgets[0].relative.toFixed(2);
    },
    renderedLoanAnnualRate() {
      return (this.loan.annualRate * 100).toFixed(2);
    },
    renderedLoanPrincipal() {
      return this.loan.principal.toFixed(2);
    },
  },
  methods: {
    buildTitle(loan, monthlyBudget) {
      return (
        `${loan.id === constants.TOTALS ? 'All Loans ' : `Loan ${this.index}`} `
        + `($${loan.principal.toFixed(2)} `
        + `@ ${(loan.annualRate * 100).toFixed(2)}%) `
        + `Total Budget: $${monthlyBudget.absolute.toFixed(2)}/mo`
      );
    },
    emitExit() {
      this.$emit('exit-details-panel');
    },
    generateKey() {
      return ''.concat(arguments.id);
    },
  },
};
</script>

<template>
  <base-modal>
    <template #header>
      <h2>{{ this.title }}</h2>
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
