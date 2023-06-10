<script>
export default {
  data() {
    return {
      budget: null,
    };
  },
  emits: ['create-budget', 'exit-create-budget'],
  computed: {
    createButtonEnabled() {
      return !Number.isNaN(parseFloat(this.budget)) && parseFloat(this.budget) > 0;
    },
  },
  methods: {
    clearCreate() {
      this.budget = null;
    },
    emitCreate() {
      this.$emit(
        'create-budget',
        parseFloat(this.budget),
      );
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
      <h2>Creating a Budget</h2>
    </template>
    <template #body>
      <div :class="['formInputs']">
        <div :class="['formInputWrapper']">
          <label>Budget</label>
          <input v-model="budget" type="number" label="Budget" />
        </div>
      </div>
    </template>
    <template #actions>
      <base-button @click="emitCreate" :class="{ createButton: true }" :disabled="!createButtonEnabled">Create</base-button>
      <base-button @click="emitExit" :class="{ createButton: true }">Close</base-button>
    </template>
  </base-modal>
</template>
