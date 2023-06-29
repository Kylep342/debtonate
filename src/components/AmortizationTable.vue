<script>
export default {
  props: ['loan', 'index', 'budget', 'paymentSummary'],
  computed: {
    cardTitle() {
      return (
        `Loan ${this.index} `
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
    <div :class="['justifyCenter']">
      <table :class="['table']">
        <thead id='AmortizationTotalsTHead'>
          <th :class="['textLeft']">Payment Number</th>
          <th :class="['textRight']">Principal Paid</th>
          <th :class="['textRight']">Interest Paid</th>
          <th :class="['textRight']">Principal Remaining</th>
        </thead>
        <tr
          v-for='(record, rowno) in this.paymentSummary.amortizationSchedule'
          :key='this.loan.id + this.budget.id + rowno'
        >
          <td :class="['textLeft']">{{ record.period }}</td>
          <td :class="['textRight']">${{ record.principal.toFixed(2) }}</td>
          <td :class="['textRight']">${{ record.interest.toFixed(2) }}</td>
          <td :class="['textRight']">
            ${{ record.principalRemaining.toFixed(2) }}
          </td>
        </tr>
        <tr>
          <td :class="['textLeft']"><b>Totals:</b></td>
          <td :class="['textRight']">
            <b>${{ this.paymentSummary.totalPrincipalPaid.toFixed(2) }}</b>
          </td>
          <td :class="['textRight']">
            <b>${{ this.paymentSummary.totalInterestPaid.toFixed(2) }}</b>
          </td>
          <td :class="['textRight']"><b> -- </b></td>
        </tr>
      </table>
    </div>
  </div>
</template>
