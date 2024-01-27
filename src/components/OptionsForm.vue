<script setup>
const props = defineProps([
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
  <base-modal>
    <template #header>
      <h2>Options</h2>
    </template>
    <template #body>
      <div :class="['formInputs']">
        <base-card>
          <div :class="['formInputWrapper']">
            <h3>Sorting Method</h3>
            <button @click='emitAvalancheSort'>Avalanche</button>
            <button @click='emitSnowballSort'>Snowball</button>
          </div>
        </base-card>
        <base-card>
          <div :class="['formInputWrapper']">
            <h3>Reduce Payments</h3>
            <button @click='emitToggleReducePayments'>
              {{ props.reducePaymentsButtonText }}
            </button>
          </div>
        </base-card>
        <base-card>
          <div :class="['formInputWrapper']">
            <h3>Rounding</h3>
            <button @click='emitToggleRoundUp'>
              {{ props.roundingButtonText }}
            </button>
          </div>
        </base-card>
        <base-card>
          <div :class="['formInputWrapper']">
            <h3>Periods As Dates</h3>
            <button @click='emitTogglePeriodsAsDates'>
              {{ props.periodsAsDatesButtonText }}
            </button>
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
