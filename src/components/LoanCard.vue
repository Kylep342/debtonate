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
  <base-card :class="['w-96', 'bg-base-100', 'shadow-xl']">
    <template #cardTitle>
      <div class="card-actions flow-root">
        <h2 :class="['cardHeaderTitle', 'float-left']">{{ title }}</h2>
        <button v-if="loan.id !== constants.TOTALS"
          :class="['exitButton', 'bold', 'btn', 'btn-ghost', 'btn-square', 'float-right']"
          @click='loanPrimitives.deleteLoan(loan.id)'
        >
          x
        </button>
      </div>
    </template>
    <template #cardContent>
      <base-table :size="['table-sm']">
        <template #body>
          <tbody>
            <tr>
              <td>Principal</td>
              <td><b>{{ principal }}</b></td>
            </tr>
            <tr>
              <td>Interest Rate</td>
              <td><b>{{ interestRate }}</b></td>
            </tr>
            <tr>
              <td>Minimum Payment</td>
              <td><b>{{ minPayment }}</b></td>
            </tr>
          </tbody>
        </template>
      </base-table>
    </template>
    <template #cardActions>
      <div v-if="loan.id !== constants.TOTALS">
        <base-button
          :class="['btn-accent']"
          @click='loanPrimitives.editLoan(loan.id)'
        >
          Edit
        </base-button>
      </div>
      <div>
        <base-button
          :class="['btn-accent']"
          @click='loanPrimitives.viewLoan(loan.id)'
        >
          View
        </base-button>
      </div>
    </template>
  </base-card>
</template>
