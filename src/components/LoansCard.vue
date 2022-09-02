<script>
export default {
  props: ["loans", "editLoan", "deleteLoan"]
}
</script>

<template>
  <div v-show="this.loans.length">
    <li v-for="(loan, index) in this.loans" :key="loan.id">
      <ul>
        <li>
          Loan {{ index + 1 }}
        </li>
        <li>
          Principal: ${{ loan.principal.toFixed(2) }}
        </li>
        <li>
          Interest Rate: {{ (loan.annualRate * 100).toFixed(2) }}%
        </li>
        <li>
          Minimum Monthly Payment: ${{ loan.minPayment.toFixed(2) }}
        </li>
      </ul>
      <button @click="this.editLoan(loan.id)">Edit</button>
      <button @click="this.deleteLoan(loan.id)">X</button>
    </li>
  </div>
</template>