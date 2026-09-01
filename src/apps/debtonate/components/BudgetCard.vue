<script setup lang="ts">
import { paymentTypes } from 'moneyfunx';
import { computed, ComputedRef } from 'vue';

import { useDebtonateCoreStore, DebtonateCoreStore } from '@/apps/debtonate/stores/core';
import ColorDot from '@/apps/shared/components/ColorDot.vue';
import constants from '@/apps/debtonate/constants/constants';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { Button } from '@/apps/shared/types/app';
import { MonthlyBudget } from '@/apps/shared/types/core';
import { Arc } from '@/apps/shared/types/graph';

const props = defineProps<{
  budget: MonthlyBudget,
  viewedLoanId: string,
}>();

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
const state: DebtonateCoreStore = useDebtonateCoreStore();

const viewedPaymentSchedule: ComputedRef<paymentTypes.PaymentSchedule> = computed(() => state.getPaymentSchedule(props.viewedLoanId, props.budget.id));

const budgetAmount: ComputedRef<string> = computed(() => `${globalOptions.Money(props.budget.absolute)}/month`);
const budgetPayments: ComputedRef<string | number | Date> = computed(() => globalOptions.Period(viewedPaymentSchedule.value.amortizationSchedule.length, true));
const budgetTotalPaid: ComputedRef<string> = computed(() => `${globalOptions.Money(viewedPaymentSchedule.value.lifetimeInterest + viewedPaymentSchedule.value.lifetimePrincipal)}`);

const paymentsLabel: ComputedRef<string> = computed(() => globalOptions.periodsAsDates ? 'Debt Free' : 'Payments')
const budgetName: ComputedRef<string> = computed(() => state.getBudgetName(props.budget.id));
const header: ComputedRef<string> = computed(() => state.budgetCardGraphConfig.header(props.viewedLoanId));

const graphContent: ComputedRef<Arc[]> = computed(() => state.cardGraphs[props.viewedLoanId][props.budget.id])

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
  <base-card
    :class="['w-full', 'bg-base-100', 'min-w-0', 'max-w-full']"
    :body-classes="['p-3', 'overflow-hidden', 'w-full', 'max-w-full']"
  >
    <template #cardTitle>
      <div class="card-actions flow-root w-full min-w-0">
        <div :class="['flex', 'justify-between', 'items-center', 'pr-2', 'min-w-0']">
          <h2 :class="['cardHeaderTitle', 'p-2', 'truncate', 'min-w-0', 'font-semibold', 'text-base']">
            {{ budgetName }}
          </h2>
          <base-menu
            :text="constants.BTN_MENU"
            :buttons="buttons"
            :classes="['btn-sm']"
          />
        </div>
      </div>
    </template>
    <template #cardBody>
      <h3
        v-if="state.loans.length"
        class="text-center font-medium text-sm truncate mb-1"
      >
        {{ header }}
      </h3>
      <donut-graph
        v-if="state.loans.length"
        :config="state.budgetCardGraphConfig"
        :graph="graphContent"
        :anchor-id="budget.id"
      />
      <base-table :class="['table-xs', 'w-full', 'max-w-full']">
        <template #body>
          <tbody>
            <template v-if="state.loans.length">
              <tr
                v-for="(datum) in graphContent"
                :key="datum.label"
              >
                <td class="truncate max-w-[110px]">
                  <ColorDot :color="datum.color || ''" />{{ datum.label }}
                </td>
                <td :class="['text-right', 'whitespace-nowrap']">
                  <b>{{ globalOptions.Money(datum.value) }}</b>
                </td>
              </tr>
            </template>
            <tr>
              <td class="truncate max-w-[110px]">
                Amount
              </td>
              <td :class="['text-right', 'whitespace-nowrap']">
                <b>{{ budgetAmount }}</b>
              </td>
            </tr>
            <tr>
              <td class="truncate max-w-[110px]">
                {{ paymentsLabel }}
              </td>
              <td :class="['text-right', 'whitespace-nowrap']">
                <b>{{ budgetPayments }}</b>
              </td>
            </tr>
            <tr>
              <td class="truncate max-w-[110px]">
                Total Paid
              </td>
              <td :class="['text-right', 'whitespace-nowrap']">
                <b>{{ budgetTotalPaid }}</b>
              </td>
            </tr>
          </tbody>
        </template>
      </base-table>
    </template>
  </base-card>
</template>
