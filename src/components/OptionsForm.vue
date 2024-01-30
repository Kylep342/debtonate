<script setup>
const props = defineProps([
  'id',
  'periodsAsDatesButtonText',
  'reducePaymentsButtonText',
  'roundingButtonText',
]);
const emits = defineEmits([
  'exit-options-form',
  'toggle-avalanche-sort',
  'toggle-periods-as-dates',
  'toggle-reduce-payments',
  'toggle-round-up',
  'toggle-snowball-sort',
]);

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
    <template #body>
      <div :class="['formInputs']">
        <base-card>
          <div :class="['formInputWrapper']">
            <h3>Sorting Method</h3>
            <base-button @click='emitAvalancheSort'>Avalanche</base-button>
            <base-button @click='emitSnowballSort'>Snowball</base-button>
          </div>
        </base-card>
        <base-card>
          <div :class="['formInputWrapper']">
            <h3>Reduce Payments</h3>
            <base-button @click='emitToggleReducePayments'>
              {{ props.reducePaymentsButtonText }}
            </base-button>
          </div>
        </base-card>
        <base-card>
          <div :class="['formInputWrapper']">
            <h3>Rounding</h3>
            <base-button @click='emitToggleRoundUp'>
              {{ props.roundingButtonText }}
            </base-button>
          </div>
        </base-card>
        <base-card>
          <div :class="['formInputWrapper']">
            <h3>Periods As Dates</h3>
            <base-button @click='emitTogglePeriodsAsDates'>
              {{ props.periodsAsDatesButtonText }}
            </base-button>
          </div>
        </base-card>
      </div>
    </template>
    <template #actions>
      <base-button @click='emitExit' :class='{ createButton: true }'
        >Close</base-button
      >
    </template>
  </base-modal>
</template>
