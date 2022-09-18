<script>
  export default {
    props: ["loans", "monthlyBudgets", "amortizationSchedulesPerLoan"]
  }
</script>

<template>
  <div>
    <ul>
      <li v-for="(loan, index) in this.loans" :key="loan.id">
        <ul>
          <li v-for="budget in this.monthlyBudgets" :key="budget.id">
            <h2>Loan {{ index + 1 }}, ${{ budget.absolute.toFixed(2) }}/mo</h2>
            <table>
              <tr>
                <th>Payment Number</th>
                <th>Principal Paid</th>
                <th>Interest Paid</th>
                <th>Principal Remaining</th>
              </tr>
              <tr v-for="(record, rowno) in this.amortizationSchedulesPerLoan[loan.id][budget.id].amortizationSchedule" :key="loan.id + budget.id + rowno">
                <td>{{ record.period }}</td>
                <td>${{ record.principal.toFixed(2) }}</td>
                <td>${{ record.interest.toFixed(2) }}</td>
                <td>${{ record.principalRemaining.toFixed(2) }}</td>
              </tr>
              <tr>
                <td>Totals:</td>
                <td>${{ this.amortizationSchedulesPerLoan[loan.id][budget.id].totalPrincipalPaid.toFixed(2) }}</td>
                <td>${{ this.amortizationSchedulesPerLoan[loan.id][budget.id].totalInterestPaid.toFixed(2) }}</td>
                <td> -- </td>
              </tr>
            </table>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
