<script>
export default {
  props: ['loan', 'index', 'budget', 'paymentSummary'],
  computed: {
    cardTitle() {
      return (`Loan ${this.index} `
        + `($${this.loan.principal.toFixed(2)} `
        + `@ ${(this.loan.annualRate * 100).toFixed(2)}%) `
        + `Total Budget: $${this.budget.absolute.toFixed(2)}/mo`
      );
    },
  },
};
</script>

<template>
  <div>
    <div>
      <h3 :class="['cardTitle']">{{ this.cardTitle }}</h3>
    </div>
    <table :class="['table']">
      <thead id="AmortizationTotalsTHead">
        <th>Payment Number</th>
        <th>Principal Paid</th>
        <th>Interest Paid</th>
        <th>Principal Remaining</th>
      </thead>
      <tr
        v-for="(record, rowno) in this.paymentSummary.amortizationSchedule"
        :key="this.loan.id + this.budget.id + rowno"
      >
        <td>{{ record.period }}</td>
        <td>${{ record.principal.toFixed(2) }}</td>
        <td>${{ record.interest.toFixed(2) }}</td>
        <td>${{ record.principalRemaining.toFixed(2) }}</td>
      </tr>
      <tr>
        <td><b>Totals:</b></td>
        <td><b>${{ this.paymentSummary.totalPrincipalPaid.toFixed(2) }}</b></td>
        <td><b>${{ this.paymentSummary.totalInterestPaid.toFixed(2) }}</b></td>
        <td><b> -- </b></td>
      </tr>
    </table>
  </div>
</template>
