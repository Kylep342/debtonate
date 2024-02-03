<script setup>
import { computed, inject } from 'vue';
import constants from '../constants/constants';

const props = defineProps(['index', 'loan']);
const loanPrimitives = inject('loanPrimitives');

const interestRate = computed(() => `${(props.loan.annualRate * 100).toFixed(2)}%`);
const minPayment = computed(() => `$${props.loan.minPayment.toFixed(2)}/mo`);
const principal = computed(() => `$${props.loan.principal.toFixed(2)}`);
const title = computed(() => (props.loan.id === constants.TOTALS ? 'All Loans' : `Loan ${props.index}`));
</script>

<template>
  <base-card>
    <template #cardTitle>
      <div class="card-actions flow-root">
        <h2 :class="['cardHeaderTitle', 'float-left']">{{ title }}</h2>
        <button v-if="loan.id !== constants.TOTALS"
          :class="['exitButton', 'bold', 'btn', 'btn-ghost', 'btn-square', 'float-right']"
          @click='loanPrimitives.deleteLoan(props.loan.id)'
        >
          x
        </button>
      </div>
    </template>
    <template #cardContent>
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
    </template>
    <template #cardActions>
      <div v-if="loan.id !== constants.TOTALS" :class="['cardFooterButtonContainer']">
        <base-button @click='loanPrimitives.editLoan(props.loan.id)'>Edit</base-button>
      </div>
      <div :class="['cardFooterButtonContainer']">
        <base-button @click='loanPrimitives.viewLoan(props.loan.id)'>View</base-button>
      </div>
    </template>
  </base-card>
</template>
