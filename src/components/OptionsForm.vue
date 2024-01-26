<script>
export default {
  props: ['periodsAsDatesButtonText', 'reducePaymentsButtonText', 'roundingButtonText'],
  emits: [
    'exit-options-form',
    'toggle-avalanche-sort',
    'toggle-periods-as-dates',
    'toggle-reduce-payments',
    'toggle-round-up',
    'toggle-snowball-sort',
  ],
  methods: {
    emitExit() {
      this.$emit('exit-options-form');
    },
    emitAvalancheSort() {
      this.$emit('toggle-avalanche-sort');
    },
    emitTogglePeriodsAsDates() {
      this.$emit('toggle-periods-as-dates');
    },
    emitToggleReducePayments() {
      this.$emit('toggle-reduce-payments');
    },
    emitToggleRoundUp() {
      this.$emit('toggle-round-up');
    },
    emitSnowballSort() {
      this.$emit('toggle-snowball-sort');
    },
  },
};
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
              {{ reducePaymentsButtonText }}
            </button>
          </div>
        </base-card>
        <base-card>
          <div :class="['formInputWrapper']">
            <h3>Rounding</h3>
            <button @click='emitToggleRoundUp'>
              {{ roundingButtonText }}
            </button>
          </div>
        </base-card>
        <base-card>
          <div :class="['formInputWrapper']">
            <h3>Periods As Dates</h3>
            <button @click='emitTogglePeriodsAsDates'>
              {{ periodsAsDatesButtonText }}
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
