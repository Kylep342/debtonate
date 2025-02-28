<script setup lang="ts">
import { computed } from 'vue';
import { ILoan } from 'moneyfunx';

import constants from '@/constants/constants';
import useCoreStore from '@/stores/core';
import { Button } from '@/types/app';

const props = defineProps<{
  loan: ILoan
}>();

const coreState = useCoreStore();

const loanCurrentBalance = computed<string>(() => `${coreState.Money(props.loan.currentBalance)}`);
const loanInterestRate = computed<string>(() => `${coreState.Percent(props.loan.annualRate * 100)}`);
const loanMinPayment = computed<string>(() => `${coreState.Money(props.loan.minPayment)}/month`);
const loanPrincipal = computed<string>(() => `${coreState.Money(props.loan.principal)}`);
const loanTermInYears = computed<string>(() => `${props.loan.termInYears}`);
const loanFees = computed<string | null>(() => props.loan.fees ? `${coreState.Money(props.loan.fees)}` : null);

const alertButtonIsDisabled = () => alert('Create a loan to use this action');

const baseButtons = computed<Array<Button>>(() => ([
  {
    text: constants.BTN_DETAILS,
    onClick: () => coreState.loans.length ? coreState.viewLoan(props.loan.id) : alertButtonIsDisabled(),
  },
  {
    text: constants.BTN_REFINANCE,
    onClick: () => coreState.loans.length ? coreState.refinanceLoan(props.loan.id) : alertButtonIsDisabled(),
  },
]));


const editButtons = computed<Array<Button>>(() => ([
  ...baseButtons.value,
  {
    text: constants.BTN_EDIT,
    onClick: () => coreState.editLoan(props.loan.id),
  },
  {
    text: constants.BTN_DELETE,
    onClick: () => coreState.deleteLoan(props.loan.id),
  },
]));

const getButtons = (loanId): Array<Button> => loanId === constants.TOTALS ? baseButtons.value : editButtons.value;
</script>

<template>
  <base-card :class="['w-75', 'bg-base-100']">
    <template #cardTitle>
      <div :class="['card-actions', 'flow-root', 'p-0']">
        <div :class="['flex', 'justify-between', 'pr-4']">
          <h2 :class="['cardHeaderTitle', 'float-left', 'p-4']">
            {{ coreState.getLoanName(loan.id) }}
          </h2>
          <base-menu :menu="constants.BTN_MENU" :buttons="getButtons(loan.id)" />
        </div>
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
            <tr>
              <td>Interest Rate</td>
              <td :class="['text-right']">
                <b>{{ loanInterestRate }}</b>
              </td>
            </tr>
            <tr>
              <td>Term</td>
              <td :class="['text-right']">
                <b>{{ loanTermInYears }} years</b>
              </td>
            </tr>
            <tr>
              <td>Minimum Payment</td>
              <td :class="['text-right']">
                <b>{{ loanMinPayment }}</b>
              </td>
            </tr>
            <tr v-if="loanPrincipal !== loanCurrentBalance">
              <td>Current Balance</td>
              <td :class="['text-right']">
                <b>{{ loanCurrentBalance }}</b>
              </td>
            </tr>
            <tr v-if="loanFees">
              <td>Fees</td>
              <td :class="['text-right']">
                <b>{{ loanFees }}</b>
              </td>
            </tr>
          </tbody>
        </template>
      </base-table>
    </template>
  </base-card>
</template>
