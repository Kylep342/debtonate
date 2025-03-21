<script setup lang="ts">
import { computed } from 'vue';

import constants from '../constants/constants';
import useAppreciateCoreStore from '../stores/core';
import useGlobalOptionsStore from '@/apps/shared/stores/globalOptions';
import sharedConstants from '@/apps/shared/constants/constants';
import { Button } from '@/apps/shared/types/app';
import { MonthlyBudget } from '@/apps/shared/types/core';

const props = defineProps<{ budget: MonthlyBudget }>();

const globalOptions = useGlobalOptionsStore();
const state = useAppreciateCoreStore();

// const totalsAsALoanPaymentSummaryForBudget = computed(() => state.getPaymentSchedule(constants.TOTALS, props.budget.id));

const budgetAmount = computed<string>(() => `${globalOptions.Money(props.budget.absolute)}/month`);
const budgetExtra = computed<string>(() => `${globalOptions.Money(props.budget.relative)}/month`);
// const budgetPayments = computed<number>(() => globalOptions.Period(totalsAsALoanPaymentSummaryForBudget.value.amortizationSchedule.length, true));
// const budgetTotalInterest = computed<string>(() => `${globalOptions.Money(totalsAsALoanPaymentSummaryForBudget.value.lifetimeInterest)}`);

// const paymentsLabel = computed<string>(() => globalOptions.periodsAsDates ? 'Debt Free' : 'Payments')

const alertButtonIsDisabled = () => alert('Create an instrument to use this action');

const baseButtons = computed<Array<Button>>(() => ([
  {
    text: sharedConstants.BTN_DETAILS,
    onClick: () => state.instruments.length ? state.viewBudget(props.budget.id) : alertButtonIsDisabled(),
  },
]));

const editButtons = computed<Array<Button>>(() => ([
  ...baseButtons.value,
  {
    text: sharedConstants.BTN_EDIT,
    onClick: () => state.editBudget(props.budget.id),
  },
  {
    text: sharedConstants.BTN_DELETE,
    onClick: () => state.deleteBudget(props.budget.id),
  },
]));

const getButtons = (budgetId): Array<Button> => budgetId === sharedConstants.DEFAULT ? baseButtons.value : editButtons.value;
</script>

<template>
  <base-card :class="['w-75', 'bg-base-100']">
    <template #cardTitle>
      <div class="card-actions flow-root">
        <div :class="['flex', 'justify-between', 'pr-4']">
          <h2 :class="['cardHeaderTitle', 'float-left', 'p-4']">
            {{ state.getBudgetName(budget.id) }}
          </h2>
          <base-menu :menu="sharedConstants.BTN_MENU" :buttons="getButtons(budget.id)" />
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
            <tr v-if="budget.id !== sharedConstants.DEFAULT">
              <td>Extra</td>
              <td :class="['text-right']">
                <b>{{ budgetExtra }}</b>
              </td>
            </tr>
            <!-- <tr>
              <td>Interest Paid</td>
              <td :class="['text-right']">
                <b>{{ budgetTotalInterest }}</b>
              </td>
            </tr> -->
            <!-- <tr>
              <td>{{ paymentsLabel }}</td>
              <td :class="['text-right']">
                <b>{{ budgetPayments }}</b>
              </td>
            </tr> -->
          </tbody>
        </template>
      </base-table>
    </template>
  </base-card>
</template>
