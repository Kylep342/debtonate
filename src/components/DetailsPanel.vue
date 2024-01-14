<script>
import AmortizationTable from './AmortizationTable.vue';

export default {
  props: [
    'index',
    'loan',
    'loanAmortizationSchedulesChart',
    'loanPaymentSummaries',
    'monthlyBudgets',
    'type',
  ],
  emits: ['exit-details-panel'],
  components: { AmortizationTable },
  computed: {
    cardTitle() {
      return (
        `Loan Details - Loan ${this.index} `
        + `($${this.loan.principal.toFixed(2)} `
        + `@ ${(this.loan.annualRate * 100).toFixed(2)}%)`
      );
    },
  },
  methods: {
    buildTitle(loan, monthlyBudget) {
      return (
        `Loan ${this.index} `
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
              :paymentSummary='this.loanPaymentSummaries[budget.id]'
              :title='this.buildTitle(this.loan, budget)'
            />
          </li>
        </ul>
        <base-chart
          :chart='this.loanAmortizationSchedulesChart'
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
