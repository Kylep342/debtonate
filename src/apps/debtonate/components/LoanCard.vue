<script setup lang="ts">
import { computed } from 'vue';
import { ILoan } from 'moneyfunx';

import constants from '@/apps/debtonate/constants/constants';
import useDebtonateCoreStore from '@/apps/debtonate/stores/core';
import sharedConstants from '@/apps/shared/constants/constants';
import useGlobalOptionsStore from '@/apps/shared/stores/globalOptions';
import { Button } from '@/apps/shared/types/app';

const props = defineProps<{
  loan: ILoan
}>();

const globalOptions = useGlobalOptionsStore();
const state = useDebtonateCoreStore();

const loanCurrentBalance = computed<string>(() => `${globalOptions.Money(props.loan.currentBalance)}`);
const loanInterestRate = computed<string>(() => `${globalOptions.Percent(props.loan.annualRate * 100)}`);
const loanMinPayment = computed<string>(() => `${globalOptions.Money(props.loan.minPayment)}/month`);
const loanPrincipal = computed<string>(() => `${globalOptions.Money(props.loan.principal)}`);
const loanTermInYears = computed<string>(() => `${props.loan.termInYears}`);
const loanFees = computed<string | null>(() => props.loan.fees ? `${globalOptions.Money(props.loan.fees)}` : null);

const alertButtonIsDisabled = () => alert('Create a loan to use this action');

const baseButtons = computed<Array<Button>>(() => ([
  {
    text: sharedConstants.BTN_DETAILS,
    onClick: () => state.loans.length ? state.viewLoan(props.loan.id) : alertButtonIsDisabled(),
  },
  {
    text: constants.BTN_REFINANCE,
    onClick: () => state.loans.length ? state.refinanceLoan(props.loan.id) : alertButtonIsDisabled(),
  },
]));


const editButtons = computed<Array<Button>>(() => ([
  ...baseButtons.value,
  {
    text: sharedConstants.BTN_EDIT,
    onClick: () => state.editLoan(props.loan.id),
  },
  {
    text: sharedConstants.BTN_DELETE,
    onClick: () => state.deleteLoan(props.loan.id),
  },
]));

const getButtons = (loanId): Array<Button> => loanId === sharedConstants.TOTALS ? baseButtons.value : editButtons.value;
</script>

<template>
  <base-card :class="['w-75', 'bg-base-100']">
    <template #cardTitle>
      <div :class="['card-actions', 'flow-root', 'p-0']">
        <div :class="['flex', 'justify-between', 'pr-4']">
          <h2 :class="['cardHeaderTitle', 'float-left', 'p-4']">
            {{ state.getLoanName(loan.id) }}
          </h2>
          <base-menu :menu="sharedConstants.BTN_MENU" :buttons="getButtons(loan.id)" />
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
