<script setup>
import { computed, ref } from 'vue';

const props = defineProps([
  'id',
  'budget',
  'createButtonText',
  'title',
]);
const emits = defineEmits([
  'create-budget',
  'exit-create-budget',
]);

const amount = ref(props.budget?.relative || null);

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
  <base-modal :id='props.id'>
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
