<script setup lang="ts">
import { computed } from 'vue';

import constants from '@/apps/debtonate/constants/constants';
import useDebtonateCoreStore from '@/apps/debtonate/stores/core';
import ColorDot from '@/apps/shared/components/ColorDot.vue';
import useGlobalOptionsStore from '@/apps/shared/stores/globalOptions';
import { Button } from '@/apps/shared/types/app';
import { MonthlyBudget } from '@/apps/shared/types/core';

const props = defineProps<{
  budget: MonthlyBudget,
  viewedLoanId: string,
}>();

const globalOptions = useGlobalOptionsStore();
const state = useDebtonateCoreStore();

const totalsPaymentSummary = computed(() => state.getPaymentSchedule(constants.TOTALS, props.budget.id));

const budgetAmount = computed<string>(() => `${globalOptions.Money(props.budget.absolute)}/month`);
const budgetPayments = computed<number>(() => globalOptions.Period(totalsPaymentSummary.value.amortizationSchedule.length, true));
const budgetTotalInterest = computed<string>(() => `${globalOptions.Money(totalsPaymentSummary.value.lifetimeInterest)}`);
const budgetTotalPaid = computed<string>(() => `${globalOptions.Money(totalsPaymentSummary.value.lifetimeInterest + totalsPaymentSummary.value.lifetimePrincipal)}`);

const paymentsLabel = computed<string>(() => globalOptions.periodsAsDates ? 'Debt Free' : 'Payments')

const graph = computed(() => state.cardGraphs[props.viewedLoanId][props.budget.id])

const alertButtonIsDisabled = () => alert('Create a loan to use this action');

const baseButtons = computed<Array<Button>>(() => ([
  {
    text: constants.BTN_DETAILS,
    onClick: () => state.loans.length ? state.viewBudget(props.budget.id) : alertButtonIsDisabled(),
  },
]));

const editButtons = computed<Array<Button>>(() => ([
  ...baseButtons.value,
  {
    text: constants.BTN_EDIT,
    onClick: () => state.editBudget(props.budget.id),
  },
  {
    text: constants.BTN_DELETE,
    onClick: () => state.deleteBudget(props.budget.id),
  },
]));

const getButtons = (budgetId): Array<Button> => (
  budgetId === constants.DEFAULT
    ? baseButtons.value
    : editButtons.value
  );
</script>

<template>
  <base-card :class="['w-75', 'bg-base-100']">
    <template #cardTitle>
      <div class="card-actions flow-root">
        <div :class="['flex', 'justify-between', 'pr-4']">
          <h2 :class="['cardHeaderTitle', 'float-left', 'p-4']">
            {{ state.getBudgetName(budget.id) }}
          </h2>
          <base-menu :text="constants.BTN_MENU" :buttons="getButtons(budget.id)" />
        </div>
      </div>
    </template>
    <template #cardBody>
      <donut-graph
        v-if="state.loans.length"
        :config="state.budgetCardGraphConfig"
        :graph="graph"
        :anchorId="budget.id"
      />
      <base-table :class="['table-sm']">
        <template #body>
          <tbody>
            <tr>
              <td>Amount</td>
              <td :class="['text-right']">
                <b>{{ budgetAmount }}</b>
              </td>
            </tr>
            <tr>
              <td>{{ paymentsLabel }}</td>
              <td :class="['text-right']">
                <b>{{ budgetPayments }}</b>
              </td>
            </tr>
            <tr>
              <td>Total Paid</td>
              <td :class="['text-right']">
                <b>{{ budgetTotalPaid }}</b>
              </td>
            </tr>
            <tr v-if="state.loans.length" v-for="(datum) in graph" :key="datum.label">
              <td><ColorDot :color="datum.color" />{{ datum.label }}</td>
              <td :class="['text-right']">
                <b>{{ globalOptions.Money(datum.value) }}</b>
              </td>
            </tr>
          </tbody>
        </template>
      </base-table>
    </template>
  </base-card>
</template>
