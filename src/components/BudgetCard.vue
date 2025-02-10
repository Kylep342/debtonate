<script setup lang="ts">
import { computed } from 'vue';

import constants from '../constants/constants';
import useCoreStore from '../stores/core';
import { MonthlyBudget } from '../types/core';

const props = defineProps<{ budget: MonthlyBudget }>();

const coreState = useCoreStore();

const totalsAsALoanPaymentSummaryForBudget = computed(() => coreState.getPaymentSchedule(constants.TOTALS, props.budget.id))

const budgetAmount = computed<String>(() => `${coreState.Money(props.budget.absolute)}/month`);
const budgetExtra = computed<String>(() => `${coreState.Money(props.budget.relative)}/month`);
const budgetPayments = computed<Number>(() => coreState.Period(totalsAsALoanPaymentSummaryForBudget.value.amortizationSchedule.length, true));
const budgetTotalInterest = computed<String>(() => `${coreState.Money(totalsAsALoanPaymentSummaryForBudget.value.lifetimeInterest)}`);

const paymentsLabel = computed<String>(() => coreState.periodsAsDates ? 'Debt Free' : 'Payments')
const alertButtonIsDisabled = () => alert('Create a loan to use this action');

const baseButtons = computed(() => ({
  [constants.BTN_DETAILS]: coreState.loans.length ? coreState.viewBudget : alertButtonIsDisabled
}));

const editButtons = computed(() => ({
  ...baseButtons.value,
  [constants.BTN_EDIT]: coreState.editBudget,
  [constants.BTN_DELETE]: coreState.deleteBudget,
}));

const getButtons = (budgetId) => budgetId === constants.DEFAULT ? baseButtons.value : editButtons.value;
</script>

<template>
  <base-card :class="['w-75', 'bg-base-100']">
    <template #cardTitle>
      <div class="card-actions flow-root">
        <div :class="['flex', 'justify-between', 'pr-4']">
          <h2 :class="['cardHeaderTitle', 'float-left', 'p-4']">
            {{ coreState.getBudgetName(budget.id) }}
          </h2>
          <div :class="['dropdown', 'dropdown-bottom', 'dropdown-end']">
            <base-button>{{ constants.BTN_MENU }}</base-button>
            <ul
              tabIndex="{0}"
              :class="['dropdown-content', 'menu', 'bg-base-100', 'rounded-box', 'z-[1]', 'w-fit', 'p-2', 'shadow']">
              <li
                v-for="(onClick, text) in getButtons(budget.id)"
                :key="text"
                @click.prevent="onClick(budget.id)"
              >
                <a>{{ text }}</a>
              </li>
            </ul>
          </div>
        </div>
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
  </base-card>
</template>
