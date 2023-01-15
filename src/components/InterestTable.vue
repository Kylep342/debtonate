<script>
export default {
  props: ['loans', 'paymentSchedules', 'globalMinPayment'],
  methods: {
    headerHover(loan, index) {
      return (`Loan ${index} `
        + `($${loan.principal.toFixed(2)} `
        + `@ ${(loan.annualRate * 100).toFixed(2)}%)`
      );
    },
  },
};
</script>

<template>
  <div>
    <table id="lifetimeInterestTotalsTable" class="table table-hover table-mc-light-blue">
      <thead id="lifetimeInterestTotalsTHead">
        <th :class="['left']">Budgets</th>
        <th :class="['cell']"
          v-for="(loan, index) in this.loans"
          :key="loan.id"
          :title="headerHover(loan, index + 1)"
        >
          Loan {{ index + 1 }}
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
  </div>
</template>
