<script>
export default {
  props: ["loans", "paymentSchedules", "globalMinPayment"]
}
</script>

<template>
  <h2>Comparison of Totals</h2>
  <table id="lifetimeInterestTotalsTable" class="table table-hover table-mc-light-blue">
    <thead id="lifetimeInterestTotalsTableHeaderRow">
      <th>Budgets (Down) | Loans (Right)</th>
      <th :class="['cell']" v-for="(loan, index) in this.loans" :key="loan.id">
        Loan {{ index + 1 }} (${{ loan.principal.toFixed(2) }} @ {{ (loan.annualRate * 100).toFixed(2) }}%)
      </th>
      <th>Totals</th>
    </thead>
    <tr :class="['textLeft']" v-for="schedule in this.paymentSchedules" :key="schedule.budgetId">
      <td :class="['cell']">
        <strong>{{ schedule.label }}</strong>
      </td>
      <td :class="['cell']" v-for="loan in this.loans" :key="loan.id">
        ${{
          schedule.paymentSchedule[loan.id].lifetimeInterest.toFixed(2)
        }}
        interest paid
        <br />
        {{
          schedule.paymentSchedule[loan.id].amortizationSchedule.length
        }}
        payments
      </td>
      <td :class="['cell']">
        ${{ schedule.paymentSchedule["totalInterest"].toFixed(2) }} total
        interest paid
        <br />
        {{ schedule.paymentSchedule["totalPayments"] }} total payments
      </td>
    </tr>
  </table>
</template>
