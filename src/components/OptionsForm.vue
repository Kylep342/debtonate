<script setup>
import { computed, ref, watch } from 'vue';

import constants from '../constants/constants';
import useCoreStore from '../stores/core';

const coreState = useCoreStore();

const _currency = ref(coreState.currency);
const _language = ref(coreState.language);
const roundingScale = ref(coreState.roundingScale);

const sortedCurrencies = computed(() => coreState.currencies.toSorted());
const sortedLanguages = computed(() => coreState.languages.toSorted());
const reducePaymentsExample = computed(
  () => (coreState.loans.length ? (`(Paying off ${coreState.getLoanName(coreState.loans[0].id)} reduces future payments by ${coreState.Money(coreState.loans[0].minPayment)})`) : ''),
);
const refinancingUseHighestPaymentExample = computed(() => {
    if (coreState.loans.length) {
      const firstLoan = coreState.loans[0]
      const basePayment = firstLoan.minPayment;
      const hypotheticalPayment = firstLoan.minPayment - (firstLoan.minPayment % 10);
      const usedPayment = coreState.refinancingUseHighestPayment ? Math.max(basePayment, hypotheticalPayment) : hypotheticalPayment;
      return `(A scenario for ${coreState.getLoanName(firstLoan.id)} [${coreState.Money(basePayment)}] with a minimum payment of ${coreState.Money(hypotheticalPayment)} uses ${coreState.Money(usedPayment)})`;
    }
    return '';
});
const repaymentPriorityExample = computed(
  () => (coreState.loans.length ? (`(Priority: ${coreState.loans.map((loan) => coreState.getLoanName(loan.id)).join( ', ')})`) : ''),
);

const buttonStyle = (flag) => (flag ? 'btn-success' : 'btn-error');
const buttonText = (flag) => (flag ? constants.BTN_ON : constants.BTN_OFF);

watch(() => _currency.value, async (newValue) => {
  coreState.setCurrency(newValue);
}, { immediate: true });

watch(() => _language.value, async (newValue) => {
  coreState.setLanguage(newValue);
}, { immediate: true });

watch(() => roundingScale.value, async (newValue) => {
  coreState.setRoundingScale(newValue);
}, { immediate: true });
</script>

<template>
  <base-modal
    :id="constants.OPTIONS_FORM_ID"
    :body-classes="['overflow-y-auto']"
  >
    <template #header>
      <h2>Options</h2>
    </template>
    <template #headerActions>
      <base-button
        :class="['btn btn-circle btn-ghost']"
        @click="coreState.exitOptionsForm"
      >
        x
      </base-button>
    </template>
    <template #body>
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
              <base-button
                :class="buttonStyle(!coreState.snowballSort)"
                @click="coreState.toggleAvalancheSort"
              >
                Avalanche
              </base-button>
              <base-button
                :class="buttonStyle(coreState.snowballSort)"
                @click="coreState.toggleSnowballSort"
              >
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
              <base-button
                :class="buttonStyle(coreState.reducePayments)"
                @click="coreState.toggleReducePayments"
              >
                {{
                  buttonText(coreState.reducePayments) }}
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
              <base-button
                :class="buttonStyle(coreState.refinancingUseHighestPayment)"
                @click="coreState.toggleRefinancingUseHighestPayment"
              >
                {{
                  buttonText(coreState.refinancingUseHighestPayment) }}
              </base-button>
            </div>
          </template>
          <template #cardBody>
            <div :class="['text-base', 'max-w-prose']">
              <p>
                When enabled this uses the higher value between
                a refinanced loan's minimum payment
                and its base loan's minimum payment
                for calculating totals for refinancing scenarios
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
              <input
                v-model.number="roundingScale"
                :class="['input input-bordered input-secondary w-full max-ws']"
                type="number"
                step="0.01"
                label="scale"
              >
              <base-button
                :class="buttonStyle(coreState.roundingEnabled)"
                @click="coreState.toggleRounding(roundingScale)"
              >
                {{ buttonText(coreState.roundingEnabled) }}
              </base-button>
            </div>
          </template>
          <template #cardBody>
            <div :class="['text-base', 'max-w-prose']">
              <p>
                When enabled this rounds your minimum contribution up to the next
                multiple of {{ coreState.Money(roundingScale) }}
              </p>
              <br>
              <p>
                Minimum Monthly Payment: {{ coreState.Money(coreState.globalMinPayment) }}
              </p>
            </div>
          </template>
        </collapsible-card>
        <collapsible-card>
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
              Periods As Dates
            </h3>
          </template>
          <template #cardTitleActions>
            <div>
              <base-button
                :class="buttonStyle(coreState.periodsAsDates)"
                @click="coreState.togglePeriodsAsDates"
              >
                {{ buttonText(coreState.periodsAsDates) }}
              </base-button>
            </div>
          </template>
          <template #cardBody>
            <div :class="['text-base', 'max-w-prose']">
              <p>
                When enabled this displays all period tags as dates (relative to
                today)
              </p>
              <br>
              <p>Next Period: {{ coreState.Period(1, true) }}</p>
            </div>
          </template>
        </collapsible-card>
        <collapsible-card>
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
              Currency
            </h3>
          </template>
          <template #cardTitleActions>
            <div>
              <select
                v-model="_currency"
                class="select select-bordered w-full max-w-xs"
              >
                <option
                  v-for="currency in sortedCurrencies"
                  :key="currency"
                  :value="currency"
                >
                  {{ currency }}
                </option>
              </select>
            </div>
          </template>
          <template #cardBody>
            <p>Money: {{ coreState.Money(coreState.globalMinPayment) }}</p>
          </template>
        </collapsible-card>
        <collapsible-card>
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
              Locale
            </h3>
          </template>
          <template #cardTitleActions>
            <div>
              <select
                v-model="_language"
                class="select select-bordered w-full max-w-xs"
              >
                <option
                  v-for="language in sortedLanguages"
                  :key="language"
                  :value="language"
                >
                  {{ language }}
                </option>
              </select>
            </div>
          </template>
          <template #cardBody>
            <p>Localization setting for formatting numbers and dates</p>
            <br>
            <p>Money: {{ coreState.Money(coreState.globalMinPayment) }}</p>
            <p>Next Period: {{ coreState.Period(1, true) }}</p>
            <p>Percent: {{ coreState.Percent(coreState.globalEffectiveInterestRate * 100) }}</p>
          </template>
        </collapsible-card>
      </div>
    </template>
  </base-modal>
</template>
