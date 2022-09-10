<script>
export default {
  props: ["loans", "paymentSchedules", "globalMinPayment"]
}
</script>

<template>
  <table id="lifetimeInterestTotalsTable">
    <tr id="lifetimeInterestTotalsTableHeaderRow">
      <th>Budgets (Down) | Loans (Right)</th>
      <th v-for="(loan, index) in this.loans" :key="loan.id">
        Loan {{ index + 1 }}
      </th>
      <th>Totals</th>
    </tr>
    <tr v-for="schedule in this.paymentSchedules" :key="schedule.budgetId">
      <td>
        <strong>{{ schedule.label }}</strong>
      </td>
      <td v-for="loan in this.loans" :key="loan.id">
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
      <td>
        ${{ schedule.paymentSchedule["totalInterest"].toFixed(2) }} total
        interest paid
        <br />
        {{ schedule.paymentSchedule["totalPayments"] }} total payments
      </td>
    </tr>
  </table>
</template>
