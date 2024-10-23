<script setup>
import { computed, ref, watch } from 'vue';

import constants from '../constants/constants';
import emitters from '../constants/emitters';
import useCoreStore from '../stores/core';

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

const state = useCoreStore();

const _currency = ref(state.currency);
const _language = ref(state.language);

const roundingScale = ref(state.roundingScale);

const buttonStyle = (flag) => (flag ? 'btn-success' : 'btn-error');
const buttonText = (flag) => (flag ? constants.BTN_ON : constants.BTN_OFF);
const reducePaymentsExample = computed(
  () => (state.loans.length ? (`(Paying off ${state.getLoanName(state.loans[0].id)} reduces future payments by: ${state.Money(state.loans[0].minPayment)})`) : ''),
);

const emitExit = () => emits(emitters.EMIT_EXIT_OPTIONS_FORM);
const emitAvalancheSort = () => emits(emitters.EMIT_TOGGLE_AVALANCHE_SORT);
const emitTogglePeriodsAsDates = () => emits(emitters.EMIT_TOGGLE_PERIODS_AS_DATES);
const emitToggleReducePayments = () => emits(emitters.EMIT_TOGGLE_REDUCE_PAYMENTS);
const emitToggleRoundUp = () => emits(emitters.EMIT_TOGGLE_ROUND_UP, roundingScale.value);
const emitSnowballSort = () => emits(emitters.EMIT_TOGGLE_SNOWBALL_SORT);

watch(() => _currency.value, async (newValue) => {
  state.setCurrency(newValue);
}, { immediate: true });

watch(() => _language.value, async (newValue) => {
  state.setLanguage(newValue);
}, { immediate: true });

watch(() => roundingScale.value, async (newValue) => {
  if (state.roundUp) {
    state.setRoundingScale(newValue);
  }
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
        @click="emitExit"
      >
        x
      </base-button>
    </template>
    <template #body>
      <div :class="['formInputs']">
        <base-card>
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
                @click="emitAvalancheSort"
              >
                Avalanche
              </base-button>
              <base-button
                :class="buttonStyle(state.snowballSort)"
                @click="emitSnowballSort"
              >
                Snowball
              </base-button>
            </div>
          </template>
        </base-card>
        <base-card>
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
                @click="emitToggleReducePayments"
              >
                {{
                  buttonText(state.reducePayments) }}
              </base-button>
            </div>
          </template>
        </base-card>
        <base-card>
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
              Rounding
            </h3>
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
          </template>
          <template #cardBody>
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
                @click="emitToggleRoundUp"
              >
                {{ buttonText(state.roundUp) }}
              </base-button>
            </div>
          </template>
        </base-card>
        <base-card>
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
                @click="emitTogglePeriodsAsDates"
              >
                {{ buttonText(state.periodsAsDates) }}
              </base-button>
            </div>
          </template>
        </base-card>
        <base-card>
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
                v-for="currency in state.currencies"
                :key="currency"
                :value="currency"
              >
                {{ currency }}
              </option>
            </select>
          </template>
        </base-card>
        <base-card>
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
              Language
            </h3>
          </template>
          <template #cardBody>
            <select
              v-model="_language"
              class="select select-bordered w-full max-w-xs"
            >
              <option
                v-for="language in state.languages"
                :key="language"
                :value="language"
              >
                {{ language }}
              </option>
            </select>
          </template>
        </base-card>
      </div>
    </template>
  </base-modal>
</template>
