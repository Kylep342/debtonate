<script>
export default {
  props: ['title', 'createButtonText', 'budget'],
  emits: ['create-budget', 'exit-create-budget'],
  data() {
    return {
      amount: this.budget?.relative || null,
    };
  },
  computed: {
    createButtonEnabled() {
      return (
        !Number.isNaN(parseFloat(this.amount)) && parseFloat(this.amount) > 0
      );
    },
  },
  methods: {
    clearCreate() {
      this.amount = null;
    },
    emitCreate() {
      this.$emit('create-budget', parseFloat(this.amount));
      this.clearCreate();
    },
    emitExit() {
      this.$emit('exit-create-budget');
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
          <label>Budget</label>
          <input v-model='amount' type='number' label='Budget' />
        </div>
      </div>
    </template>
    <template #actions>
      <base-button
        @click='emitCreate'
        :class='{ createButton: true }'
        :disabled='!createButtonEnabled'
        >{{ createButtonText }}</base-button
      >
      <base-button @click='emitExit' :class='{ createButton: true }'
        >Close</base-button
      >
    </template>
  </base-modal>
</template>
