<script setup>
import { computed, inject } from 'vue';
import constants from '../constants/constants';

const props = defineProps(['loan']);

const formatters = inject('formatters');
const loanPrimitives = inject('loanPrimitives');

const loanInterestRate = computed(() => `${(props.loan.annualRate * 100).toFixed(2)}%`);
const loanMinPayment = computed(() => `${formatters.Money(props.loan.minPayment)}/month`);
const loanPrincipal = computed(() => `${formatters.Money(props.loan.principal)}`);

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
                <b>{{ loanPrincipal }}</b>
              </td>
            </tr>
            <tr>
              <td>Interest Rate</td>
              <td>
                <b>{{ loanInterestRate }}</b>
              </td>
            </tr>
            <tr>
              <td>Minimum Payment</td>
              <td>
                <b>{{ loanMinPayment }}</b>
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
