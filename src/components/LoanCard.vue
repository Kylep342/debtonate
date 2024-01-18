<script>
import constants from '../constants/constants';

export default {
  props: ['deleteLoan', 'editLoan', 'index', 'loan', 'viewLoan'],
  data() {
    return {
      constants,
    };
  },
  computed: {
    renderedMinPayment() {
      return `$${this.loan.minPayment.toFixed(2)}/mo`;
    },
    renderedPrincipal() {
      return `$${this.loan.principal.toFixed(2)}`;
    },
    renderedRate() {
      return `${(this.loan.annualRate * 100).toFixed(2)}%`;
    },
    title() {
      return this.loan.id === constants.TOTALS ? 'All Loans' : `Loan ${this.index}`;
    },
  },
};
</script>

<template>
  <div>
    <div :class="['cardHeader', 'header']">
      <h2 :class="['cardHeaderTitle']">{{ title }}</h2>
      <div :class="['cardheaderSubSection']">
        <button v-if="loan.id !== constants.TOTALS"
          :class="['exitButton', 'bold']"
          @click='this.deleteLoan(this.loan.id)'
        >
          x
        </button>
      </div>
    </div>
    <div :class="['cardBody']">
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
      <div v-if="loan.id !== constants.TOTALS" :class="['cardFooterButtonContainer']">
        <button @click='this.editLoan(this.loan.id)'>Edit</button>
      </div>
      <div :class="['cardFooterButtonContainer']">
        <button @click='this.viewLoan(this.loan.id)'>View</button>
      </div>
    </div>
  </div>
</template>
