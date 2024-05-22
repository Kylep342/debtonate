<script setup>
import { inject, ref } from 'vue';

const props = defineProps(['id']);

const emits = defineEmits([
  'exit-options-form',
  'toggle-avalanche-sort',
  'toggle-periods-as-dates',
  'toggle-reduce-payments',
  'toggle-round-up',
  'toggle-snowball-sort',
]);

const options = inject('options');
const periodsAsDates = ref(options.periodsAsDates);
const reducePayments = ref(options.reducePayments);
const roundUp = ref(options.roundUp);
const snowballSort = ref(options.snowballSort);

const buttonStyle = (flag) => (flag ? 'btn-success' : 'btn-error');
const buttonText = (flag) => (flag ? 'On' : 'Off');

const emitExit = () => emits('exit-options-form');
const emitAvalancheSort = () => emits('toggle-avalanche-sort');
const emitTogglePeriodsAsDates = () => emits('toggle-periods-as-dates');
const emitToggleReducePayments = () => emits('toggle-reduce-payments');
const emitToggleRoundUp = () => emits('toggle-round-up');
const emitSnowballSort = () => emits('toggle-snowball-sort');
</script>

<template>
  <base-modal :id="props.id">
    <template #header>
      <h2>Options</h2>
    </template>
    <template #headerActions>
      <base-button @click="emitExit" :class="['btn btn-circle btn-ghost']">
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
            <p>Avalanche orders loans by descending interest rate</p>
            <p>Snowball orders loans by ascending balance</p>
          </template>
          <template #cardActions>
            <div :class="['card-actions', 'justify-end', 'p-4']">
              <base-button
                :class="buttonStyle(!snowballSort)"
                @click="emitAvalancheSort"
              >
                Avalanche
              </base-button>
              <base-button
                :class="buttonStyle(snowballSort)"
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
            <p>
              When enabled this reduces your total minimum contribution each
              time you pay off a loan
            </p>
          </template>
          <template #cardActions>
            <div :class="['card-actions', 'justify-end', 'p-4']">
              <base-button
                :class="buttonStyle(reducePayments)"
                @click="emitToggleReducePayments"
              >
                {{ buttonText(reducePayments) }}
              </base-button>
            </div>
          </template>
        </base-card>
        <base-card>
          <template #cardTitle>
            <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">Rounding</h3>
          </template>
          <template #cardBody>
            <p>
              When enabled this rounds your minimum contribution up to the next
              multiple of 100
            </p>
          </template>
          <template #cardActions>
            <div :class="['card-actions', 'justify-end', 'p-4']">
              <base-button
                :class="buttonStyle(roundUp)"
                @click="emitToggleRoundUp"
              >
                {{ buttonText(roundUp) }}
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
            <p>
              When enabled this displays all period tags as dates (relative to
              today)
            </p>
          </template>
          <template #cardActions>
            <div :class="['card-actions', 'justify-end', 'p-4']">
              <base-button
                :class="buttonStyle(periodsAsDates)"
                @click="emitTogglePeriodsAsDates"
              >
                {{ buttonText(periodsAsDates) }}
              </base-button>
            </div>
          </template>
        </base-card>
      </div>
    </template>
  </base-modal>
</template>
