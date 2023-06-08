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
    emitCreate() {
      this.$emit(
        'create-loan',
        parseFloat(this.principal),
        parseFloat(this.interestRate) / 100,
        parseFloat(this.termInYears),
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
  <base-modal>
    <template v-slot:header>
      <h2>{{ title }}</h2>
    </template>
    <template v-slot:body>
      <div :class="['formInputs']">
        <div :class="['formInputWrapper']">
          <label>Principal</label>
          <input v-model="principal" type="number" label="Principal" />
        </div>
        <div :class="['formInputWrapper']">
          <label>Interest</label>
          <input v-model="interestRate" type="number" label="Interest" />
        </div>
        <div :class="['formInputWrapper']">
          <label>Term</label>
          <input v-model="termInYears" type="number" label="Term Length" />
        </div>
      </div>
    </template>
    <template v-slot:actions>
      <base-button @click="emitCreate" :class="{ createButton: true }" :disabled="!createButtonEnabled">Create</base-button>
      <base-button @click="emitExit" :class="{ createButton: true }">Close</base-button>
    </template>
  </base-modal>
</template>
