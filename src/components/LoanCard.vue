<script setup>
import { computed, inject } from 'vue';
import constants from '../constants/constants';

const props = defineProps(['loan']);
const interestRate = computed(() => `${(props.loan.annualRate * 100).toFixed(2)}%`);
const minPayment = computed(() => `$${props.loan.minPayment.toFixed(2)}/month`);
const principal = computed(() => `$${props.loan.principal.toFixed(2)}`);

const loanPrimitives = inject('loanPrimitives');
</script>

<template>
  <base-card :class="['w-75', 'bg-base-100']">
    <template #cardTitle>
      <div :class="['card-actions', 'flow-root', 'p-0']">
        <h2 :class="['cardHeaderTitle', 'float-left', 'p-4']">{{ loanPrimitives.getLoanName(loan.id) }}</h2>
        <button v-if="loan.id !== constants.TOTALS" :class="[
          'exitButton',
          'bold',
          'btn',
          'btn-ghost',
          'btn-square',
          'float-right',
        ]" @click="loanPrimitives.deleteLoan(loan.id)">
          x
        </button>
      </div>
    </template>
    <template #cardBody>
      <base-table :class="['table-sm']">
        <template #body>
          <tbody>
            <tr>
              <td>Principal</td>
              <td>
                <b>{{ principal }}</b>
              </td>
            </tr>
            <tr>
              <td>Interest Rate</td>
              <td>
                <b>{{ interestRate }}</b>
              </td>
            </tr>
            <tr>
              <td>Minimum Payment</td>
              <td>
                <b>{{ minPayment }}</b>
              </td>
            </tr>
          </tbody>
        </template>
      </base-table>
    </template>
    <template #cardActions>
      <div :class="['card-actions', 'justify-end', 'p-4']">
        <div v-if="loan.id !== constants.TOTALS">
          <base-button :class="['btn-accent']" @click="loanPrimitives.editLoan(loan.id)">
            Edit
          </base-button>
        </div>
        <div>
          <base-button :class="['btn-accent']" @click="loanPrimitives.viewLoan(loan.id)">
            View
          </base-button>
        </div>
      </div>
    </template>
  </base-card>
</template>
