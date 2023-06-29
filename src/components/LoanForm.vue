<script>
export default {
  props: ['title', 'createButtonText', 'loan'],
  emits: ['create-loan', 'exit-create-loan'],
  data() {
    return {
      principal: this.loan?.principal || null,
      interestRate: ((this.loan?.annualRate || null) * 100).toFixed(2) || null,
      termInYears: this.loan?.termInYears || null,
    };
  },
  computed: {
    createButtonEnabled() {
      return [this.principal, this.interestRate, this.termInYears].every(
        (input) => !Number.isNaN(parseFloat(input)) && parseFloat(input) > 0,
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
      this.$emit('exit-create-loan');
      this.clearCreate();
    },
  },
};
</script>

<template>
  <base-modal>
    <template #header>
      <h2>{{ title }}</h2>
    </template>
    <template #body>
      <div :class="['formInputs']">
        <div :class="['formInputWrapper']">
          <label>Principal</label>
          <input v-model='principal' type='number' label='Principal' />
        </div>
        <div :class="['formInputWrapper']">
          <label>Interest</label>
          <input v-model='interestRate' type='number' label='Interest' />
        </div>
        <div :class="['formInputWrapper']">
          <label>Term</label>
          <input v-model='termInYears' type='number' label='Term Length' />
        </div>
      </div>
    </template>
    <template #actions>
      <base-button
        @click='emitCreate'
        :class='{ createButton: true }'
        :disabled='!createButtonEnabled'
      >
        {{ createButtonText }}
      </base-button>
      <base-button @click='emitExit' :class='{ createButton: true }'
        >Close</base-button
      >
    </template>
  </base-modal>
</template>
