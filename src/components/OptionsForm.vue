<script setup>
import { computed, ref, watch } from 'vue';

import constants from '../constants/constants';
import useCoreStore from '../stores/core';

const state = useCoreStore();

const _currency = ref(state.currency);
const _language = ref(state.language);
const roundingScale = ref(state.roundingScale);

const sortedCurrencies = computed(() => state.currencies.toSorted());
const sortedLanguages = computed(() => state.languages.toSorted());
const reducePaymentsExample = computed(
  () => (state.loans.length ? (`(Paying off ${state.getLoanName(state.loans[0].id)} reduces future payments by: ${state.Money(state.loans[0].minPayment)})`) : ''),
);

const buttonStyle = (flag) => (flag ? 'btn-success' : 'btn-error');
const buttonText = (flag) => (flag ? constants.BTN_ON : constants.BTN_OFF);

watch(() => _currency.value, async (newValue) => {
  state.setCurrency(newValue);
}, { immediate: true });

watch(() => _language.value, async (newValue) => {
  state.setLanguage(newValue);
}, { immediate: true });

watch(() => roundingScale.value, async (newValue) => {
  state.setRoundingScale(newValue);
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
        @click="state.exitOptionsForm"
      >
        x
      </base-button>
    </template>
    <template #body>
      <div :class="['formInputs']">
        <collapsible-card>
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
              Repayment Priority
            </h3>
          </template>
          <template #cardBody>
            <div :class="['text-base', 'max-w-prose']">
              <p>Avalanche orders loans by descending interest rate</p>
              <p>Snowball orders loans by ascending principal</p>
            </div>
          </template>
          <template #cardActions>
            <div :class="['card-actions', 'justify-end', 'p-4']">
              <base-button
                :class="buttonStyle(!state.snowballSort)"
                @click="state.toggleAvalancheSort"
              >
                Avalanche
              </base-button>
              <base-button
                :class="buttonStyle(state.snowballSort)"
                @click="state.toggleSnowballSort"
              >
                Snowball
              </base-button>
            </div>
          </template>
        </collapsible-card>
        <collapsible-card>
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
              Reduce Payments
            </h3>
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
          <template #cardActions>
            <div :class="['card-actions', 'justify-end', 'p-4']">
              <base-button
                :class="buttonStyle(state.reducePayments)"
                @click="state.toggleReducePayments"
              >
                {{
                  buttonText(state.reducePayments) }}
              </base-button>
            </div>
          </template>
        </collapsible-card>
        <collapsible-card>
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
              Rounding
            </h3>
          </template>
          <template #cardBody>
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
            <div :class="['text-base', 'max-w-prose']">
              <p>
                When enabled this rounds your minimum contribution up to the next
                multiple of {{ state.Money(roundingScale) }}
              </p>
            </div>
          </template>
          <template #cardActions>
            <div :class="['card-actions', 'justify-end', 'p-4']">
              <base-button
                :class="buttonStyle(state.roundUp)"
                @click="state.toggleRounding(roundingScale)"
              >
                {{ buttonText(state.roundUp) }}
              </base-button>
            </div>
          </template>
        </collapsible-card>
        <collapsible-card>
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
              Periods As Dates
            </h3>
          </template>
          <template #cardBody>
            <div :class="['text-base', 'max-w-prose']">
              <p>
                When enabled this displays all period tags as dates (relative to
                today)
              </p>
            </div>
          </template>
          <template #cardActions>
            <div :class="['card-actions', 'justify-end', 'p-4']">
              <base-button
                :class="buttonStyle(state.periodsAsDates)"
                @click="state.togglePeriodsAsDates"
              >
                {{ buttonText(state.periodsAsDates) }}
              </base-button>
            </div>
          </template>
        </collapsible-card>
        <collapsible-card>
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
              Currency
            </h3>
          </template>
          <template #cardBody>
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
          </template>
        </collapsible-card>
        <collapsible-card>
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
              Locale
            </h3>
          </template>
          <template #cardBody>
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
          </template>
        </collapsible-card>
      </div>
    </template>
  </base-modal>
</template>
