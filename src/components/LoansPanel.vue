<script>
export default {
  props: ["loans", "editLoan", "deleteLoan"]
}
</script>

<template>
  <div id="LoansPanel" v-show="this.loans.length">
    <ul class="cardHolder">
      <li v-for="(loan, index) in this.loans" :key="loan.id" class="card">
        <div :class="['cardHeader', 'header']">
          <p class="cardHeaderTitle">
            Loan {{ index + 1 }}
          </p>
          <div class="cardHeaderButtonContainer">
            <button class="exitButton" @click="this.deleteLoan(loan.id)">x</button>
          </div>
        </div>
        <div class="cardBody">
          <table class="">
            <tr>
              <td class="justifyLeft">Principal</td>
              <td class="justifyRight"><b>${{ loan.principal.toFixed(2) }}</b></td>
            </tr>
            <tr>
              <td class="justifyLeft">Interest Rate</td>
              <td class="justifyRight"><b>{{ (loan.annualRate * 100).toFixed(2) }}%</b></td>
            </tr>
            <tr>
              <td class="justifyLeft">Monthly Payment</td>
              <td class="justifyRight"><b>${{ loan.minPayment.toFixed(2) }}</b></td>
            </tr>
          </table>
        </div>
        <div :class="['cardFooter', 'footer']">
          <div class="cardFooterButtonContainer">
            <button @click="this.editLoan(loan.id)">Edit</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
