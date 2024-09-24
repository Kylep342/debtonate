<script setup>
import { computed, inject } from 'vue';
import constants from '../constants/constants';

const props = defineProps(['budget', 'budgetTotals']);

const budgetPrimitives = inject('budgetPrimitives');
const formatters = inject('formatters');

const budgetAmount = computed(() => `${formatters.Money(props.budget.absolute)}/month`);
const budgetExtra = computed(() => `+${formatters.Money(props.budget.relative)}/month`);
const budgetPayments = computed(() => props.budgetTotals.amortizationSchedule.length);
const budgetTotalInterest = computed(() => `${formatters.Money(props.budgetTotals.lifetimeInterest)}`);
</script>

<template>
  <base-card :class="['w-75', 'bg-base-100']">
    <template #cardTitle>
      <div class="card-actions flow-root">
        <h2 :class="['cardHeaderTitle', 'float-left', 'p-4']">
          {{ budgetPrimitives.getBudgetName(budget.id) }}
        </h2>
        <button v-if="budget.id !== constants.DEFAULT" :class="[
          'exitButton',
          'bold',
          'btn',
          'btn-ghost',
          'btn-square',
          'float-right',
        ]" @click="budgetPrimitives.deleteBudget(budget.id)">
          x
        </button>
      </div>
    </template>
    <template #cardBody>
      <base-table :class="['table-sm']">
        <template #body>
          <tbody>
            <tr>
              <td>Amount</td>
              <td>
                <b>{{ budgetAmount }}</b>
              </td>
            </tr>
            <tr v-if="budget.id !== constants.DEFAULT">
              <td>Extra</td>
              <td>
                <b>{{ budgetExtra }}</b>
              </td>
            </tr>
            <tr>
              <td>Interest Paid</td>
              <td>
                <b>{{ budgetTotalInterest }}</b>
              </td>
            </tr>
            <tr>
              <td>Payments</td>
              <td>
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
          <base-button :class="['btn-accent']" @click="budgetPrimitives.editBudget(budget.id)">
            Edit
          </base-button>
        </div>
        <div>
          <base-button :class="['btn-accent']" @click="budgetPrimitives.viewBudget(budget.id)">
            View
          </base-button>
        </div>
      </div>
    </template>
  </base-card>
</template>
