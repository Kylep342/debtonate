<script setup lang="ts">
import { computed } from 'vue';

import constants from '@/constants/constants';
import useCoreStore from '@/stores/core';
import { MonthlyBudget } from '@/types/core';

const props = defineProps<{ budget: MonthlyBudget }>();

const coreState = useCoreStore();

const totalsAsALoanPaymentSummaryForBudget = computed(() => coreState.getPaymentSchedule(constants.TOTALS, props.budget.id));

const budgetAmount = computed<string>(() => `${coreState.Money(props.budget.absolute)}/month`);
const budgetExtra = computed<string>(() => `${coreState.Money(props.budget.relative)}/month`);
const budgetPayments = computed<number>(() => coreState.Period(totalsAsALoanPaymentSummaryForBudget.value.amortizationSchedule.length, true));
const budgetTotalInterest = computed<string>(() => `${coreState.Money(totalsAsALoanPaymentSummaryForBudget.value.lifetimeInterest)}`);

const paymentsLabel = computed<String>(() => coreState.periodsAsDates ? 'Debt Free' : 'Payments')
const alertButtonIsDisabled = () => alert('Create a loan to use this action');

const baseButtons = computed(() => ([
  {
    text: constants.BTN_DETAILS,
    onClick: () => coreState.loans.length ? coreState.viewBudget(props.budget.id) : alertButtonIsDisabled(),
  },
]));

const editButtons = computed(() => ([
  ...baseButtons.value,
  {
    text: constants.BTN_EDIT,
    onClick: () => coreState.editBudget(props.budget.id),
  },
  {
    text: constants.BTN_DELETE,
    onClick: () => coreState.deleteBudget(props.budget.id),
  },
]));

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
          <base-menu
            :menu="constants.BTN_MENU"
            :buttons="getButtons(budget.id)"
          />
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
