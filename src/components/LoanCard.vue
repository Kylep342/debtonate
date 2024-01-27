<script setup>
import { computed } from 'vue';
import constants from '../constants/constants';

const props = defineProps(['deleteLoan', 'editLoan', 'index', 'loan', 'viewLoan']);

const interestRate = computed(() => `${(props.loan.annualRate * 100).toFixed(2)}%`);
const minPayment = computed(() => `$${props.loan.minPayment.toFixed(2)}/mo`);
const principal = computed(() => `$${props.loan.principal.toFixed(2)}`);
const title = computed(() => (props.loan.id === constants.TOTALS ? 'All Loans' : `Loan ${props.index}`));
</script>

<template>
  <div>
    <div :class="['cardHeader', 'header']">
      <h2 :class="['cardHeaderTitle']">{{ title }}</h2>
      <div :class="['cardheaderSubSection']">
        <button v-if="loan.id !== constants.TOTALS"
          :class="['exitButton', 'bold']"
          @click='props.deleteLoan(props.loan.id)'
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
            <b>{{ principal }}</b>
          </td>
        </tr>
        <tr>
          <td :class="['textLeft']">Interest Rate</td>
          <td :class="['textRight']">
            <b>{{ interestRate }}</b>
          </td>
        </tr>
        <tr>
          <td :class="['textLeft']">Minimum Payment</td>
          <td :class="['textRight']">
            <b>{{ minPayment }}</b>
          </td>
        </tr>
      </table>
    </div>
    <div :class="['cardFooter', 'footer']">
      <div v-if="loan.id !== constants.TOTALS" :class="['cardFooterButtonContainer']">
        <button @click='props.editLoan(props.loan.id)'>Edit</button>
      </div>
      <div :class="['cardFooterButtonContainer']">
        <button @click='props.viewLoan(props.loan.id)'>View</button>
      </div>
    </div>
  </div>
</template>
