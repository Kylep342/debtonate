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
  <div :class="['justifyCenter']">
    <table id="lifetimeInterestTotalsTable" :class="['table']">
      <thead id="lifetimeInterestTotalsTHead">
        <th :class="['cell', 'textLeft']">Budgets</th>
        <th :class="['cell', 'textLeft']">Details</th>
        <th :class="['cell', 'textRight']"
          v-for="(loan, index) in this.loans"
          :key="loan.id"
          :title="headerHover(loan, index + 1)"
        >
          Loan {{ index + 1 }}
        </th>
        <th :class="['cell', 'textRight']">Totals</th>
      </thead>
      <tr v-for="schedule in this.paymentSchedules" :key="schedule.budgetId">
        <td :class="['cell']">
          <strong>{{ schedule.label }}</strong>
        </td>
        <td :class="['cell']">
          <ul>
            <li>
              Interest Paid
            </li>
            <li>Payments</li>
          </ul>
        </td>
        <td :class="['cell', 'textRight']" v-for="loan in this.loans" :key="loan.id">
          <ul>
            <li>
              ${{
                schedule.paymentSchedule[loan.id].lifetimeInterest.toFixed(2)
              }}
            </li>
            <li>
              {{
                schedule.paymentSchedule[loan.id].amortizationSchedule.length
              }}
            </li>
          </ul>
        </td>
        <td :class="['cell', 'textRight']">
          <strong>
            ${{ schedule.paymentSchedule["totalInterest"].toFixed(2) }}
            <br />
            {{ schedule.paymentSchedule["totalPayments"] }}
          </strong>
        </td>
      </tr>
    </table>
  </div>
</template>
