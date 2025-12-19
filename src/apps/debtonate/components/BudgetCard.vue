<script setup lang="ts">
import * as moneyfunx from 'moneyfunx';
import { computed, ComputedRef } from 'vue';

import { useDebtonateCoreStore, DebtonateCoreStore } from '@/apps/debtonate/stores/core';
import ColorDot from '@/apps/shared/components/ColorDot.vue';
import constants from '@/apps/debtonate/constants/constants';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { Button } from '@/apps/shared/types/app';
import { MonthlyBudget } from '@/apps/shared/types/core';
import { DonutGraphContent } from '@/apps/shared/types/graph';

const props = defineProps<{
  budget: MonthlyBudget,
  viewedLoanId: string,
}>();

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
const state: DebtonateCoreStore = useDebtonateCoreStore();

const viewedPaymentSchedule: ComputedRef<moneyfunx.PaymentSchedule> = computed(() => state.getPaymentSchedule(props.viewedLoanId, props.budget.id));

const budgetAmount: ComputedRef<string> = computed(() => `${globalOptions.Money(props.budget.absolute)}/month`);
const budgetPayments: ComputedRef<string|number> = computed(() => globalOptions.Period(viewedPaymentSchedule.value.amortizationSchedule.length, true));
const budgetTotalPaid: ComputedRef<string> = computed(() => `${globalOptions.Money(viewedPaymentSchedule.value.lifetimeInterest + viewedPaymentSchedule.value.lifetimePrincipal)}`);

const paymentsLabel: ComputedRef<string> = computed(() => globalOptions.periodsAsDates ? 'Debt Free' : 'Payments')
const budgetName: ComputedRef<string> = computed(() => state.getBudgetName(props.budget.id));
const header: ComputedRef<string> = computed(() => state.budgetCardGraphConfig.header(props.viewedLoanId));

const graphContent: ComputedRef<DonutGraphContent> = computed(() => state.cardGraphs[props.viewedLoanId][props.budget.id])

const alertButtonIsDisabled = (): void => alert('Create a loan to use this action');

const baseButtons: ComputedRef<Button[]> = computed(() => ([
  {
    text: constants.BTN_DETAILS,
    onClick: () => state.loans.length ? state.viewBudget(props.budget.id) : alertButtonIsDisabled(),
  },
]));

const editButtons: ComputedRef<Button[]> = computed(() => ([
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

const buttons: ComputedRef<Button[]> = computed(() => props.budget.id === constants.DEFAULT ? baseButtons.value : editButtons.value);
</script>

<template>
  <base-card :class="['w-75', 'bg-base-100']">
    <template #cardTitle>
      <div class="card-actions flow-root">
        <div :class="['flex', 'justify-between', 'pr-4']">
          <h2 :class="['cardHeaderTitle', 'float-left', 'p-4']">{{ budgetName }}</h2>
          <base-menu :text="constants.BTN_MENU" :buttons="buttons" />
        </div>
      </div>
    </template>
    <template #cardBody>
      <h3 v-if="state.loans.length">{{ header }}</h3>
      <donut-graph
        v-if="state.loans.length"
        :config="state.budgetCardGraphConfig"
        :graph="graphContent"
        :anchorId="budget.id"
      />
      <base-table :class="['table-sm']">
        <template #body>
          <tbody>
            <tr v-if="state.loans.length" v-for="(datum) in graphContent" :key="datum.label">
              <td><ColorDot :color="datum.color" />{{ datum.label }}</td>
              <td :class="['text-right']"><b>{{ globalOptions.Money(datum.value) }}</b></td>
            </tr>
            <tr>
              <td>Amount</td>
              <td :class="['text-right']"><b>{{ budgetAmount }}</b></td>
            </tr>
            <tr>
              <td>{{ paymentsLabel }}</td>
              <td :class="['text-right']"><b>{{ budgetPayments }}</b></td>
            </tr>
            <tr>
              <td>Total Paid</td>
              <td :class="['text-right']"><b>{{ budgetTotalPaid }}</b></td>
            </tr>
          </tbody>
        </template>
      </base-table>
    </template>
  </base-card>
</template>
