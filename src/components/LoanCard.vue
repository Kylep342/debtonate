<script>
export default {
  props: ['deleteLoan', 'editLoan', 'loan', 'index', 'viewLoan'],
  computed: {
    renderedPrincipal() {
      return `$${this.loan.principal.toFixed(2)}`;
    },
    renderedRate() {
      return `${(this.loan.annualRate * 100).toFixed(2)}%`;
    },
    renderedMinPayment() {
      return `$${this.loan.minPayment.toFixed(2)}/mo`;
    },
  },
};
</script>

<template>
  <div>
    <div :class="['cardHeader', 'header']">
      <h2 :class="['cardHeaderTitle']">Loan {{ this.index }}</h2>
      <div :class="['cardheaderSubSection']">
        <button
          :class="['exitButton', 'bold']"
          @click='this.deleteLoan(this.loan.id)'
        >
          x
        </button>
      </div>
    </div>
    <div class='cardBody'>
      <table :class="['cardTable']">
        <tr>
          <td :class="['textLeft']">Principal</td>
          <td :class="['textRight']">
            <b>{{ renderedPrincipal }}</b>
          </td>
        </tr>
        <tr>
          <td :class="['textLeft']">Interest Rate</td>
          <td :class="['textRight']">
            <b>{{ renderedRate }}</b>
          </td>
        </tr>
        <tr>
          <td :class="['textLeft']">Minimum Payment</td>
          <td :class="['textRight']">
            <b>{{ renderedMinPayment }}</b>
          </td>
        </tr>
      </table>
    </div>
    <div :class="['cardFooter', 'footer']">
      <div :class="['cardFooterButtonContainer']">
        <button @click='this.viewLoan(this.loan.id)'>View</button>
      </div>
      <div :class="['cardFooterButtonContainer']">
        <button @click='this.editLoan(this.loan.id)'>Edit</button>
      </div>
    </div>
  </div>
</template>
