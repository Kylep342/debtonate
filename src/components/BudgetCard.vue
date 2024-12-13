<script setup>
import { computed } from 'vue';
import constants from '../constants/constants';
import useCoreStore from '../stores/core';

const props = defineProps(['budget', 'budgetTotals']);

const coreState = useCoreStore();

const budgetAmount = computed(() => `${coreState.Money(props.budget.absolute)}/month`);
const budgetExtra = computed(() => `${coreState.Money(props.budget.relative)}/month`);
const budgetPayments = computed(() => coreState.Period(props.budgetTotals.amortizationSchedule.length, true));
const budgetTotalInterest = computed(() => `${coreState.Money(props.budgetTotals.lifetimeInterest)}`);

const paymentsLabel = computed(() => coreState.periodsAsDates ? 'Debt Free' : 'Payments')
</script>

<template>
  <collapsible-card :class="['w-75', 'bg-base-100']">
    <template #cardTitle>
      <div class="card-actions flow-root">
        <h2 :class="['cardHeaderTitle', 'float-left', 'p-4']">
          {{ coreState.getBudgetName(budget.id) }}
        </h2>
      </div>
    </template>
    <template #cardBody>
      <base-table :class="['table-sm']">
        <template #body>
          <tbody>
            <tr>
              <td>Amount</td>
              <td :class="['text-right']">
                <b>{{ budgetAmount }}</b>
              </td>
            </tr>
            <tr v-if="budget.id !== constants.DEFAULT">
              <td>Extra</td>
              <td :class="['text-right']">
                <b>{{ budgetExtra }}</b>
              </td>
            </tr>
            <tr>
              <td>Interest Paid</td>
              <td :class="['text-right']">
                <b>{{ budgetTotalInterest }}</b>
              </td>
            </tr>
            <tr>
              <td>{{ paymentsLabel }}</td>
              <td :class="['text-right']">
                <b>{{ budgetPayments }}</b>
              </td>
            </tr>
          </tbody>
        </template>
      </base-table>
    </template>
    <template #cardActions>
      <div :class="['card-actions', 'justify-end', 'p-4']">
        <div v-if="budget.id !== constants.DEFAULT">
          <base-button
            :class="['btn-error']"
            @click="coreState.deleteBudget(budget.id)"
          >
            Delete
          </base-button>
        </div>
        <div v-if="budget.id !== constants.DEFAULT">
          <base-button
            :class="['btn-accent']"
            @click="coreState.editBudget(budget.id)"
          >
            Edit
          </base-button>
        </div>
        <div>
          <base-button
            :class="['btn-accent']"
            @click="coreState.viewBudget(budget.id)"
          >
            View
          </base-button>
        </div>
      </div>
    </template>
  </collapsible-card>
</template>
