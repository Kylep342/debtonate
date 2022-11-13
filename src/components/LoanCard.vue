<script>
export default {
  props: ['deleteLoan', 'editLoan', 'loan', 'index', 'viewLoan'],
};
</script>

<template>
  <div>
    <div :class="['cardHeader', 'header']">
      <p class="cardHeaderTitle">
        Loan {{ this.index }}
      </p>
      <div class="cardHeaderButtonContainer">
        <button :class="['exitButton', 'bold']" @click="this.deleteLoan(this.loan.id)">x</button>
      </div>
    </div>
    <div class="cardBody">
      <table class="">
        <tr>
          <td class="textLeft">Principal</td>
          <td class="textRight"><b>${{ this.loan.principal.toFixed(2) }}</b></td>
        </tr>
        <tr>
          <td class="textLeft">Interest Rate</td>
          <td class="textRight"><b>{{ (this.loan.annualRate * 100).toFixed(2) }}%</b></td>
        </tr>
        <tr>
          <td class="textLeft">Monthly Payment</td>
          <td class="textRight"><b>${{ this.loan.minPayment.toFixed(2) }}</b></td>
        </tr>
      </table>
    </div>
    <div :class="['cardFooter', 'footer']">
      <div class="cardFooterButtonContainer">
        <button @click="this.viewLoan(this.loan.id)">View</button>
      </div>
      <div class="cardFooterButtonContainer">
        <button @click="this.editLoan(this.loan.id)">Edit</button>
      </div>
    </div>
  </div>
</template>
