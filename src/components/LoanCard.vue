<script setup>
import { computed } from 'vue';
import constants from '../constants/constants';
import useCoreStore from '../stores/core';

const props = defineProps(['loan']);

const state = useCoreStore();

const loanInterestRate = computed(() => `${state.Percent(props.loan.annualRate * 100)}`);
const loanMinPayment = computed(() => `${state.Money(props.loan.minPayment)}/month`);
const loanPrincipal = computed(() => `${state.Money(props.loan.principal)}`);
const loanCurrentBalance = computed(() => `${state.Money(props.loan.currentBalance)}`);

</script>

<template>
  <collapsible-card :class="['w-75', 'bg-base-100']">
    <template #cardTitle>
      <div :class="['card-actions', 'flow-root', 'p-0']">
        <h2 :class="['cardHeaderTitle', 'float-left', 'p-4']">
          {{ state.getLoanName(loan.id) }}
        </h2>
      </div>
    </template>
    <template #cardBody>
      <base-table :class="['table-sm']">
        <template #body>
          <tbody>
            <tr>
              <td>Principal</td>
              <td :class="['text-right']">
                <b>{{ loanPrincipal }}</b>
              </td>
            </tr>
            <tr v-if="loanPrincipal !== loanCurrentBalance">
              <td>Current Balance</td>
              <td :class="['text-right']">
                <b>{{ loanCurrentBalance }}</b>
              </td>
            </tr>
            <tr>
              <td>Interest Rate</td>
              <td :class="['text-right']">
                <b>{{ loanInterestRate }}</b>
              </td>
            </tr>
            <tr>
              <td>Minimum Payment</td>
              <td :class="['text-right']">
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
          <base-button
            v-if="loan.id !== constants.TOTALS"
            :class="['btn-error']"
            @click="state.deleteLoan(loan.id)"
          >
            Delete
          </base-button>
        </div>
        <div v-if="loan.id !== constants.TOTALS">
          <base-button
            :class="['btn-accent']"
            @click="state.editLoan(loan.id)"
          >
            Edit
          </base-button>
        </div>
        <div>
          <base-button
            :class="['btn-accent']"
            @click="state.viewLoan(loan.id)"
          >
            View
          </base-button>
        </div>
      </div>
    </template>
  </collapsible-card>
</template>
