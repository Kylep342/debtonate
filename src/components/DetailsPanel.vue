<script>
import AmortizationTable from './AmortizationTable.vue';

export default {
  props: [
    'loan',
    'index',
    'monthlyBudgets',
    'loanPaymentSummaries',
    'loanAmortizationSchedulesChart',
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
    emitExit() {
      this.$emit('exit-details-panel');
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
            :key='this.loan.id + budget.id'
          >
            <AmortizationTable
              :id="'amortizationTable' + loan.id + budget.id"
              :loan='this.loan'
              :index='this.index'
              :budget='budget'
              :paymentSummary='this.loanPaymentSummaries[budget.id]'
            />
          </li>
        </ul>
        <base-chart
          :id="'amortizationChart' + loan.id"
          :chart='this.loanAmortizationSchedulesChart'
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
