<script setup lang="ts">
import { computed } from 'vue';
import { ILoan } from 'moneyfunx';

import constants from '@/apps/debtonate/constants/constants';
import useDebtonateCoreStore from '@/apps/debtonate/stores/core';
import ColorDot from '@/apps/shared/components/ColorDot.vue';
import useGlobalOptionsStore from '@/apps/shared/stores/globalOptions';
import { Button } from '@/apps/shared/types/app';

const props = defineProps<{
  loan: ILoan,
  viewedBudgetId: string,
}>();

const globalOptions = useGlobalOptionsStore();
const state = useDebtonateCoreStore();

const loanCurrentBalance = computed<string>(() => `${globalOptions.Money(props.loan.currentBalance)}`);
const loanInterestRate = computed<string>(() => `${globalOptions.Percent(props.loan.annualRate * 100)}`);
const loanMinPayment = computed<string>(() => `${globalOptions.Money(props.loan.minPayment)}/month`);
const loanPrincipal = computed<string>(() => `${globalOptions.Money(props.loan.principal)}`);
const loanTermInYears = computed<string>(() => `${props.loan.termInYears}`);
const loanFees = computed<string | null>(() => props.loan.fees ? `${globalOptions.Money(props.loan.fees)}` : null);

const buttons = computed<Button[]>(() => props.loan.id === constants.TOTALS ? baseButtons.value : editButtons.value);
const header = computed<string>(() => state.loanCardGraphConfig.header(props.viewedBudgetId));
const loanName = computed<string>(() => state.getLoanName(props.loan.id));

const graph = computed(() => state.cardGraphs[props.loan.id][props.viewedBudgetId])

const alertButtonIsDisabled = () => alert('Create a loan to use this action');

const baseButtons = computed<Button[]>(() => ([
  {
    text: constants.BTN_DETAILS,
    onClick: () => state.loans.length ? state.viewLoan(props.loan.id) : alertButtonIsDisabled(),
  },
  {
    text: constants.BTN_REFINANCE,
    onClick: () => state.loans.length ? state.refinanceLoan(props.loan.id) : alertButtonIsDisabled(),
  },
]));

const editButtons = computed<Button[]>(() => ([
  ...baseButtons.value,
  {
    text: constants.BTN_EDIT,
    onClick: () => state.editLoan(props.loan.id),
  },
  {
    text: constants.BTN_DELETE,
    onClick: () => state.deleteLoan(props.loan.id),
  },
]));
</script>

<template>
  <base-card :class="['w-75', 'bg-base-100']">
    <template #cardTitle>
      <div :class="['card-actions', 'flow-root', 'p-0']">
        <div :class="['flex', 'justify-between', 'pr-4']">
          <h2 :class="['cardHeaderTitle', 'float-left', 'p-4']">{{ loanName }}</h2>
          <base-menu :text="constants.BTN_MENU" :buttons="buttons" />
        </div>
      </div>
    </template>
    <template #cardBody>
      <h3 v-if="state.loans.length">{{ header }}</h3>
      <donut-graph
        v-if="state.loans.length"
        :config="state.loanCardGraphConfig"
        :graph="graph"
        :anchorId="loan.id"
      />
      <base-table :class="['table-sm']">
        <template #body>
          <tbody>
            <tr v-if="state.loans.length" v-for="(datum) in graph" :key="datum.label">
              <td><ColorDot :color="datum.color" />{{ datum.label }}</td>
              <td :class="['text-right']">
                <b>{{ globalOptions.Money(datum.value) }}</b>
              </td>
            </tr>
            <tr>
              <td>Principal</td>
              <td :class="['text-right']"><b>{{ loanPrincipal }}</b></td>
            </tr>
            <tr>
              <td>Interest Rate</td>
              <td :class="['text-right']"><b>{{ loanInterestRate }}</b></td>
            </tr>
            <tr>
              <td>Term</td>
              <td :class="['text-right']"><b>{{ loanTermInYears }} years</b></td>
            </tr>
            <tr>
              <td>Minimum Payment</td>
              <td :class="['text-right']"><b>{{ loanMinPayment }}</b></td>
            </tr>
            <tr v-if="loanPrincipal !== loanCurrentBalance">
              <td>Current Balance</td>
              <td :class="['text-right']"><b>{{ loanCurrentBalance }}</b></td>
            </tr>
            <tr v-if="loanFees">
              <td>Fees</td>
              <td :class="['text-right']"><b>{{ loanFees }}</b></td>
            </tr>
          </tbody>
        </template>
      </base-table>
    </template>
  </base-card>
</template>
