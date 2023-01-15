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
  <div id="createBudgetForm" class="modalFrame">
    <div :class="['modal']">
      <div :class="['header']">
        <h2 :class="['headerTitle']">Creating a Budget</h2>
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
              <label>Budget</label>
              <input v-model="budget" type="number" label="Budget" />
          </div>
        </div>
      </div>
        <div :class="['cardFooter', 'footer']">
          <div :class="['cardFooterButtonContainer']">
            <button
              @click="emitCreate"
              :class="{ active: createButtonEnabled, createButton: true }"
              :disabled="!createButtonEnabled"
            >
              Create
            </button>
          </div>
        </div>
    </div>
  </div>
</template>
