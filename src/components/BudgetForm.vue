<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps(['budget', 'createButtonText', 'id', 'title']);
const emits = defineEmits(['create-budget', 'exit-create-budget']);

const amount = ref(props.budget?.relative);

const createButtonEnabled = computed(
  () => !Number.isNaN(amount.value) && amount.value > 0,
);

watch(
  () => props.budget,
  (newBudget) => {
    if (newBudget) {
      amount.value = newBudget.relative;
    }
  },
  { immediate: true },
);

const clearCreate = () => {
  amount.value = null;
};

const emitCreate = () => {
  emits('create-budget', amount.value);
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
        <input :class="['input input-bordered input-secondary w-full max-ws']" v-model.number="amount" type="number"
          label="Budget" />
      </div>
    </template>
    <template #actions>
      <base-button @click="emitCreate" :disabled="!createButtonEnabled" :class="'btn-success'">
        {{ createButtonText }}
      </base-button>
    </template>
  </base-modal>
</template>
