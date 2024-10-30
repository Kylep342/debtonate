<script setup>
import { computed, ref, watch } from 'vue';

import constants from '../constants/constants';
import useCoreStore from '../stores/core';

<<<<<<< HEAD
const emits = defineEmits([
  emitters.EMIT_EXIT_OPTIONS_FORM,
  emitters.EMIT_SET_CURRENCY,
  emitters.EMIT_SET_LANGUAGE,
  emitters.EMIT_TOGGLE_AVALANCHE_SORT,
  emitters.EMIT_TOGGLE_PERIODS_AS_DATES,
  emitters.EMIT_TOGGLE_REDUCE_PAYMENTS,
  emitters.EMIT_TOGGLE_ROUND_UP,
  emitters.EMIT_TOGGLE_SNOWBALL_SORT,
]);

=======
>>>>>>> develop
const state = useCoreStore();

const _currency = ref(state.currency);
const _language = ref(state.language);
<<<<<<< HEAD

const roundingScale = ref(state.roundingScale);

=======
const roundingScale = ref(state.roundingScale);

const sortedCurrencies = computed(() => state.currencies.toSorted());
const sortedLanguages = computed(() => state.languages.toSorted());
const reducePaymentsExample = computed(
  () => (state.loans.length ? (`(Paying off ${state.getLoanName(state.loans[0].id)} reduces future payments by: ${state.Money(state.loans[0].minPayment)})`) : ''),
);

>>>>>>> develop
const buttonStyle = (flag) => (flag ? 'btn-success' : 'btn-error');
const buttonText = (flag) => (flag ? constants.BTN_ON : constants.BTN_OFF);
const reducePaymentsExample = computed(
  () => (state.loans.length ? (`(Paying off ${state.getLoanName(state.loans[0].id)} reduces future payments by: ${state.Money(state.loans[0].minPayment)})`) : ''),
);

<<<<<<< HEAD
const emitExit = () => emits(emitters.EMIT_EXIT_OPTIONS_FORM);
const emitAvalancheSort = () => emits(emitters.EMIT_TOGGLE_AVALANCHE_SORT);
const emitTogglePeriodsAsDates = () => emits(emitters.EMIT_TOGGLE_PERIODS_AS_DATES);
const emitToggleReducePayments = () => emits(emitters.EMIT_TOGGLE_REDUCE_PAYMENTS);
const emitToggleRoundUp = () => emits(emitters.EMIT_TOGGLE_ROUND_UP, roundingScale.value);
const emitSnowballSort = () => emits(emitters.EMIT_TOGGLE_SNOWBALL_SORT);

=======
>>>>>>> develop
watch(() => _currency.value, async (newValue) => {
  state.setCurrency(newValue);
}, { immediate: true });

watch(() => _language.value, async (newValue) => {
  state.setLanguage(newValue);
}, { immediate: true });

watch(() => roundingScale.value, async (newValue) => {
<<<<<<< HEAD
  if (state.roundUp) {
    state.setRoundingScale(newValue);
  }
=======
  state.setRoundingScale(newValue);
>>>>>>> develop
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
<<<<<<< HEAD
        @click="emitExit"
=======
        @click="state.exitOptionsForm"
>>>>>>> develop
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
<<<<<<< HEAD
                @click="emitAvalancheSort"
=======
                @click="state.toggleAvalancheSort"
>>>>>>> develop
              >
                Avalanche
              </base-button>
              <base-button
                :class="buttonStyle(state.snowballSort)"
<<<<<<< HEAD
                @click="emitSnowballSort"
=======
                @click="state.toggleSnowballSort"
>>>>>>> develop
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
<<<<<<< HEAD
                @click="emitToggleReducePayments"
=======
                @click="state.toggleReducePayments"
>>>>>>> develop
              >
                {{
                  buttonText(state.reducePayments) }}
              </base-button>
            </div>
          </template>
<<<<<<< HEAD
        </base-card>
        <base-card>
=======
        </collapsible-card>
        <collapsible-card>
>>>>>>> develop
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
              Rounding
            </h3>
<<<<<<< HEAD
=======
          </template>
          <template #cardBody>
>>>>>>> develop
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
<<<<<<< HEAD
          </template>
          <template #cardBody>
=======
>>>>>>> develop
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
<<<<<<< HEAD
                @click="emitToggleRoundUp"
=======
                @click="state.toggleRounding(roundingScale)"
>>>>>>> develop
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
<<<<<<< HEAD
                @click="emitTogglePeriodsAsDates"
=======
                @click="state.togglePeriodsAsDates"
>>>>>>> develop
              >
                {{ buttonText(state.periodsAsDates) }}
              </base-button>
            </div>
          </template>
<<<<<<< HEAD
        </base-card>
        <base-card>
=======
        </collapsible-card>
        <collapsible-card>
>>>>>>> develop
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
<<<<<<< HEAD
                v-for="currency in state.currencies"
=======
                v-for="currency in sortedCurrencies"
>>>>>>> develop
                :key="currency"
                :value="currency"
              >
                {{ currency }}
              </option>
            </select>
          </template>
<<<<<<< HEAD
        </base-card>
        <base-card>
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
              Language
=======
        </collapsible-card>
        <collapsible-card>
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
              Locale
>>>>>>> develop
            </h3>
          </template>
          <template #cardBody>
            <select
              v-model="_language"
              class="select select-bordered w-full max-w-xs"
            >
              <option
<<<<<<< HEAD
                v-for="language in state.languages"
=======
                v-for="language in sortedLanguages"
>>>>>>> develop
                :key="language"
                :value="language"
              >
                {{ language }}
              </option>
            </select>
          </template>
<<<<<<< HEAD
        </base-card>
=======
        </collapsible-card>
>>>>>>> develop
      </div>
    </template>
  </base-modal>
</template>
