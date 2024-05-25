<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps(['budget', 'createButtonText', 'id', 'title']);
const emits = defineEmits(['create-budget', 'exit-create-budget']);

const budget = ref(props.budget);
const amount = ref(0);

watch(budget, (newBudget) => {
  amount.value = newBudget.relative;
});

const createButtonEnabled = computed(
  () => !Number.isNaN(parseFloat(amount.value)) && parseFloat(amount.value) > 0,
);

const clearCreate = () => {
  amount.value = null;
};

const emitCreate = () => {
  emits('create-budget', parseFloat(amount.value));
  clearCreate();
};

const emitExit = () => {
  emits('exit-create-budget');
  clearCreate();
};
</script>

<template>
  <base-modal :id="props.id">
    <template #header>
      <h2>{{ title }}</h2>
    </template>
    <template #headerActions>
      <base-button @click="emitExit" :class="['btn btn-circle btn-ghost']">
        x
      </base-button>
    </template>
    <template #body>
      <div :class="['formInputs']">
        <div :class="['label']">
          <span :class="['label-text']">Budget</span>
        </div>
        <input
          :class="['input input-bordered input-secondary w-full max-ws']"
          v-model="amount"
          type="number"
          label="Budget"
        />
      </div>
    </template>
    <template #actions>
      <base-button
        @click="emitCreate"
        :disabled="!createButtonEnabled"
        :class="'btn-success'"
      >
        {{ createButtonText }}
      </base-button>
    </template>
  </base-modal>
</template>
