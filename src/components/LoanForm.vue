<script>
export default {
  props: ['title', 'createButtonText', 'loan'],
  emits: ['create-loan', 'exit-create-loan'],
  data() {
    return {
      principal: null,
      interestRate: null,
      termInYears: null,
    };
  },
  computed: {
    createButtonEnabled() {
      return [this.principal, this.interestRate, this.termInYears].every(
        (current) => !Number.isNaN(parseFloat(current)) && parseFloat(current) > 0,
      );
    },
  },
  methods: {
    clearCreate() {
      this.principal = null;
      this.interestRate = null;
      this.termInYears = null;
    },
    emitCreate(createAnother) {
      this.$emit(
        'create-loan',
        parseFloat(this.principal),
        parseFloat(this.interestRate) / 100,
        parseFloat(this.termInYears),
        createAnother,
      );
      this.clearCreate();
    },
    emitExit() {
      this.$emit(
        'exit-create-loan',
      );
      this.clearCreate();
    },
  },
  watch: {
    loan(val) {
      this.principal = val?.principal || null;
      this.interestRate = ((val?.annualRate || null) * 100) || null;
      this.termInYears = val?.termInYears || null;
    },
  },
};
</script>

<template>
  <div id="createLoanForm" class="modalFrame">
    <div :class="['modal']">
      <div :class="['header']">
        <h2 :class="['headerTitle']">{{ title }}</h2>
        <div :class="['headerButtonContainer']">
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
              <label>Principal</label>
              <input
                v-model="principal"
                type="number"
                label="Principal"
              />
          </div>
          <div :class="['formInputWrapper']">
              <label>Interest</label>
              <input
                v-model="interestRate"
                type="number"
                label="Interest"
              />
          </div>
          <div :class="['formInputWrapper']">
              <label>Term</label>
              <input
                v-model="termInYears"
                type="number"
                label="Term Length"
              />
          </div>
        </div>
      </div>
      <div :class="['cardFooter', 'footer']">
        <div :class="['cardFooterButtonContainer']">
          <button
            @click="emitCreate(false)"
            :class="{ active: createButtonEnabled, createButton: true }"
            :disabled="!createButtonEnabled"
          >
            {{ createButtonText }}
          </button>
          <button
            @click="emitCreate(true)"
            :class="{ active: createButtonEnabled, createButton: true }"
            :disabled="!createButtonEnabled"
          >
            Create Another
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
