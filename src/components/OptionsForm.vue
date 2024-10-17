<script setup>
import constants from '../constants/constants';
import emitters from '../constants/emitters';
import useCoreStore from '../stores/core';

const props = defineProps(['id']);

const emits = defineEmits([
  emitters.EMIT_EXIT_OPTIONS_FORM,
  emitters.EMIT_TOGGLE_AVALANCHE_SORT,
  emitters.EMIT_TOGGLE_PERIODS_AS_DATES,
  emitters.EMIT_TOGGLE_REDUCE_PAYMENTS,
  emitters.EMIT_TOGGLE_ROUND_UP,
  emitters.EMIT_TOGGLE_SNOWBALL_SORT,
]);

const state = useCoreStore();

const buttonStyle = (flag) => (flag ? 'btn-success' : 'btn-error');
const buttonText = (flag) => (flag ? constants.BTN_ON : constants.BTN_OFF);

const emitExit = () => emits(emitters.EMIT_EXIT_OPTIONS_FORM);
const emitAvalancheSort = () => emits(emitters.EMIT_TOGGLE_AVALANCHE_SORT);
const emitTogglePeriodsAsDates = () => emits(emitters.EMIT_TOGGLE_PERIODS_AS_DATES);
const emitToggleReducePayments = () => emits(emitters.EMIT_TOGGLE_REDUCE_PAYMENTS);
const emitToggleRoundUp = () => emits(emitters.EMIT_TOGGLE_ROUND_UP);
const emitSnowballSort = () => emits(emitters.EMIT_TOGGLE_SNOWBALL_SORT);
</script>

<template>
  <base-modal :id="props.id"
:bodyClasses="['overflow-y-auto']">
    <template #header>
      <h2>Options</h2>
    </template>
    <template #headerActions>
      <base-button @click="emitExit"
:class="['btn btn-circle btn-ghost']">
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
              <base-button :class="buttonStyle(!state.snowballSort)"
@click="emitAvalancheSort">
                Avalanche
              </base-button>
              <base-button :class="buttonStyle(state.snowballSort)"
@click="emitSnowballSort">
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
            </div>
          </template>
          <template #cardActions>
            <div :class="['card-actions', 'justify-end', 'p-4']">
              <base-button :class="buttonStyle(state.reducePayments)"
@click="emitToggleReducePayments">
                {{ buttonText(state.reducePayments) }}
              </base-button>
            </div>
          </template>
        </base-card>
        <base-card>
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">Rounding</h3>
          </template>
          <template #cardBody>
            <div :class="['text-base', 'max-w-prose']">
              <p>
                When enabled this rounds your minimum contribution up to the next
                multiple of 100
              </p>
            </div>
          </template>
          <template #cardActions>
            <div :class="['card-actions', 'justify-end', 'p-4']">
              <base-button :class="buttonStyle(state.roundUp)"
@click="emitToggleRoundUp">
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
              <base-button :class="buttonStyle(state.periodsAsDates)"
@click="emitTogglePeriodsAsDates">
                {{ buttonText(state.periodsAsDates) }}
              </base-button>
            </div>
          </template>
        </base-card>
      </div>
    </template>
  </base-modal>
</template>
