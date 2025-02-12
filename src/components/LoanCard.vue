<script setup lang="ts">
import { computed } from 'vue';
import { ILoan } from 'moneyfunx';

import constants from '../constants/constants';
import useCoreStore from '../stores/core';

const props = defineProps<{
  loan: ILoan
}>();

const coreState = useCoreStore();

const loanCurrentBalance = computed<string>(() => `${coreState.Money(props.loan.currentBalance)}`);
const loanInterestRate = computed<string>(() => `${coreState.Percent(props.loan.annualRate * 100)}`);
const loanMinPayment = computed<string>(() => `${coreState.Money(props.loan.minPayment)}/month`);
const loanPrincipal = computed<string>(() => `${coreState.Money(props.loan.principal)}`);
const loanTermInYears = computed<string>(() => `${props.loan.termInYears}`);
const loanFees = computed<string>(() => props.loan.fees ? `${coreState.Money(props.loan.fees)}` : undefined);

const alertButtonIsDisabled = () => alert('Create a loan to use this action');

const baseButtons = computed(() => ({
  [constants.BTN_DETAILS]: coreState.loans.length ? coreState.viewLoan : alertButtonIsDisabled,
  [constants.BTN_REFINANCE]: coreState.loans.length ? coreState.refinanceLoan : alertButtonIsDisabled,
}));

const editButtons = computed(() => ({
  ...baseButtons.value,
  [constants.BTN_EDIT]: coreState.editLoan,
  [constants.BTN_DELETE]: coreState.deleteLoan,
}));

const getButtons = (loanId) => loanId === constants.TOTALS ? baseButtons.value : editButtons.value;
</script>

<template>
  <base-card :class="['w-75', 'bg-base-100']">
    <template #cardTitle>
      <div :class="['card-actions', 'flow-root', 'p-0']">
        <div :class="['flex', 'justify-between', 'pr-4']">
          <h2 :class="['cardHeaderTitle', 'float-left', 'p-4']">
            {{ coreState.getLoanName(loan.id) }}
          </h2>
          <div :class="['dropdown', 'dropdown-bottom', 'dropdown-end']">
            <base-button>{{ constants.BTN_MENU }}</base-button>
            <ul
              tabIndex="{0}"
              :class="['dropdown-content', 'menu', 'bg-base-100', 'rounded-box', 'z-[1]', 'w-fit', 'p-2', 'shadow']"
            >
              <li
                v-for="(onClick, text) in getButtons(loan.id)"
                :key="text"
                @click.prevent="onClick(loan.id)"
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
