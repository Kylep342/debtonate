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
  <base-modal :id='props.id'>
    <template #header>
      <h2>Options</h2>
    </template>
    <template #headerActions>
      <base-button @click='emitExit' :class="['btn btn-circle btn-ghost']">
        x
      </base-button>
    </template>
    <template #body>
      <div :class="['formInputs']">
        <base-card>
          <template #cardTitle>
            <h3>Sorting Method</h3>
          </template>
          <template #cardActions>
            <base-button
              :class='buttonStyle(!snowballSort)'
              @click='emitAvalancheSort'
            >
              Avalanche
            </base-button>
            <base-button
              :class='buttonStyle(snowballSort)'
              @click='emitSnowballSort'
            >
              Snowball
            </base-button>
          </template>
        </base-card>
        <base-card>
          <template #cardTitle>
            <h3>Reduce Payments</h3>
          </template>
          <template #cardActions>
            <base-button
              :class='buttonStyle(reducePayments)'
              @click='emitToggleReducePayments'
            >
              {{ buttonText(reducePayments) }}
            </base-button>
          </template>
        </base-card>
        <base-card>
          <template #cardTitle>
            <h3>Rounding</h3>
          </template>
          <template #cardActions>
            <base-button
              :class='buttonStyle(roundUp)'
              @click='emitToggleRoundUp'
            >
              {{ buttonText(roundUp) }}
            </base-button>
          </template>
        </base-card>
        <base-card>
          <template #cardTitle>
            <h3>Periods As Dates</h3>
          </template>
          <template #cardActions>
            <base-button
              :class='buttonStyle(periodsAsDates)'
              @click='emitTogglePeriodsAsDates'
            >
              {{ buttonText(periodsAsDates) }}
            </base-button>
          </template>
        </base-card>
      </div>
    </template>
  </base-modal>
</template>
