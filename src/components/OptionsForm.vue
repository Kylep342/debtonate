<script>
export default {
  props: [
    'snowballSort',
    'reducePayments',
    'roundUp',
  ],
  emits: [
    'toggle-avalanche-sort',
    'toggle-snowball-sort',
    'toggle-reduce-payments',
    'toggle-round-up',
    'exit-options-form',
  ],
  data() {
    return {
      formSnowballSort: null,
      formReducePayments: null,
      formRoundUp: null,
    };
  },
  computed: {
    reducePaymentsButtonText() {
      return this.formReducePayments ? 'Turn Off' : 'Turn On';
    },
    roundingButtonText() {
      return this.formRoundUp ? 'Disable' : 'Enable';
    },
  },
  methods: {
    emitAvalancheSort() {
      this.$emit('toggle-avalanche-sort');
    },
    emitSnowballSort() {
      this.$emit('toggle-snowball-sort');
    },
    emitToggleReducePayments() {
      this.$emit('toggle-reduce-payments');
    },
    emitToggleRoundUp() {
      this.$emit('toggle-round-up');
    },
    emitExit() {
      this.$emit('exit-options-form');
    },
  },
  watch: {
    snowballSort(val) {
      this.formSnowballSort = val;
    },
    reducePayments(val) {
      this.formReducePayments = val;
    },
    roundUp(val) {
      this.formRoundUp = val;
    },
  },
};
</script>

<template>
  <div id="optionsForm" class="modalFrame">
    <div :class="['modal']">
      <div :class="['header']">
        <h2 :class="['headerTitle']">Options</h2>
        <div :class="['headerSubSection']">
          <button
            @click="emitExit"
            :class="{ exitButton: true, bold: true }"
          >
            x
          </button>
        </div>
      </div>
      <div :class="['cardBody']">
        <div :class="['formInputs']">
          <div :class="['formInputWrapper']">
            <h3>Sorting Method</h3>
            <button
              @click="emitAvalancheSort"
            >
              Avalanche
            </button>
            <button
              @click="emitSnowballSort"
            >
              Snowball
            </button>
          </div>
          <div :class="['formInputWrapper']">
            <h3>Reduce Payments</h3>
            <button
              @click="emitToggleReducePayments"
            >
              {{ reducePaymentsButtonText }}
            </button>
          </div>
          <div :class="['formInputWrapper']">
            <h3>Rounding</h3>
            <button
              @click="emitToggleRoundUp"
            >
              {{ roundingButtonText }} Rounding
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
