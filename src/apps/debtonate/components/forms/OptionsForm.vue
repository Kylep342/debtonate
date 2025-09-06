<script setup lang="ts">
import { computed } from 'vue';

import constants from '@/apps/debtonate/constants/constants';
import useDebtonateCoreStore from '@/apps/debtonate/stores/core';
import GlobalOptionsFormlet from '@/apps/shared/components/forms/GlobalOptionsFormlet.vue';
import useGlobalOptionsStore from '@/apps/shared/stores/globalOptions';

const globalOptions = useGlobalOptionsStore();
const state = useDebtonateCoreStore();

const reducePaymentsExample = computed<string>(
  () => (state.loans.length ? (`(Paying off ${state.getLoanName(state.loans[0].id)} reduces future payments by ${globalOptions.Money(state.loans[0].minPayment)})`) : ''),
);
const refinancingUseHighestPaymentExample = computed<string>(() => {
  if (state.loans.length) {
    const firstLoan = state.loans[0]
    const basePayment = firstLoan.minPayment;
    const hypotheticalPayment = Math.max(firstLoan.minPayment - (firstLoan.minPayment % 10), 100);
    const usedPayment = state.refinancingUseHighestPayment ? Math.max(basePayment, hypotheticalPayment) : hypotheticalPayment;
    return `(A scenario for ${state.getLoanName(firstLoan.id)} [${globalOptions.Money(basePayment)}] with a minimum payment of ${globalOptions.Money(hypotheticalPayment)} uses ${globalOptions.Money(usedPayment)})`;
  }
  return '';
});
const repaymentPriorityExample = computed<string>(
  () => (state.loans.length ? (`(Priority: ${state.loans.map((loan) => state.getLoanName(loan.id)).join(', ')})`) : ''),
);

const buttonStyle = (flag) => (flag ? 'btn-success' : 'btn-error');
const buttonText = (flag) => (flag ? constants.BTN_ON : constants.BTN_OFF);
</script>

<template>
  <base-modal :body-classes="['overflow-y-auto']" @exit="state.exitOptionsForm">
    <template #header>
      <h2>Options</h2>
    </template>
    <template #headerActions>
      <base-button :class="['btn btn-circle btn-ghost']" @click="state.exitOptionsForm">
        x
      </base-button>
    </template>
    <template #body>
      <h3>Debtonate Options</h3>
      <br>
      <hr>
      <br>
      <div :class="['formInputs']">
        <collapsible-card>
          <template #cardTitle>
            <div :class="['flex', 'flex-row']">
              <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
                Repayment Priority
              </h3>
            </div>
          </template>
          <template #cardTitleActions>
            <div>
              <base-button :class="buttonStyle(!state.snowballSort)" @click="state.toggleAvalancheSort">
                Avalanche
              </base-button>
              <base-button :class="buttonStyle(state.snowballSort)" @click="state.toggleSnowballSort">
                Snowball
              </base-button>
            </div>
          </template>
          <template #cardBody>
            <div :class="['text-base', 'max-w-prose']">
              <p>Avalanche prioritizes loans by descending interest rate</p>
              <p>Snowball prioritizes loans by ascending principal</p>
              <br>
              <p>
                {{ repaymentPriorityExample }}
              </p>
            </div>
          </template>
        </collapsible-card>
        <collapsible-card>
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
              Reduce Payments
            </h3>
          </template>
          <template #cardTitleActions>
            <div>
              <base-button :class="buttonStyle(state.reducePayments)" @click="state.toggleReducePayments">
                {{
                  buttonText(state.reducePayments) }}
              </base-button>
            </div>
          </template>
          <template #cardBody>
            <div :class="['text-base', 'max-w-prose']">
              <p>
                When enabled this reduces your total minimum contribution each
                time you pay off a loan
              </p>
              <br>
              <p>
                {{ reducePaymentsExample }}
              </p>
            </div>
          </template>
        </collapsible-card>
        <collapsible-card>
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
              Refinancing - Use Highest Payment
            </h3>
          </template>
          <template #cardTitleActions>
            <div>
              <base-button :class="buttonStyle(state.refinancingUseHighestPayment)"
                @click="state.toggleRefinancingUseHighestPayment">
                {{
                  buttonText(state.refinancingUseHighestPayment) }}
              </base-button>
            </div>
          </template>
          <template #cardBody>
            <div :class="['text-base', 'max-w-prose']">
              <p>
                When enabled this uses the higher value between
                a refinanced loan's minimum payment
                and its base loan's minimum payment
                when projecting refinancing scenarios
              </p>
              <br>
              <p>
                {{ refinancingUseHighestPaymentExample }}
              </p>
            </div>
          </template>
        </collapsible-card>
        <collapsible-card>
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
              Rounding
            </h3>
          </template>
          <template #cardTitleActions>
            <div :class="['flex', 'flex-row']">
              <div :class="['label']">
                <span :class="['label-text']">scale:</span>
              </div>
              <input :id="`${constants.OPTIONS_FORM_ID}-rounding-scale`" v-model.number="state.roundingScale"
                :class="['input input-bordered input-secondary w-full max-ws']" type="number" step="0.01" label="scale">
              <base-button :class="buttonStyle(state.roundingEnabled)"
                @click="state.toggleRounding(state.roundingScale)">
                {{ buttonText(state.roundingEnabled) }}
              </base-button>
            </div>
          </template>
          <template #cardBody>
            <div :class="['text-base', 'max-w-prose']">
              <p>
                When enabled this rounds your minimum contribution up to the next
                multiple of {{ globalOptions.Money(state.roundingScale) }}
              </p>
              <br>
              <p>
                Minimum Monthly Payment: {{ globalOptions.Money(state.totalMinPayment) }}
              </p>
            </div>
          </template>
        </collapsible-card>
        <br>
        <hr>
        <br>
        <global-options-formlet />
      </div>
    </template>
  </base-modal>
</template>
