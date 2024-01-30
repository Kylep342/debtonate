<script setup>
import {
  computed,
  ref,
} from 'vue';

const props = defineProps([
  'id',
  'createButtonText',
  'loan',
  'title',
]);
const emits = defineEmits([
  'create-loan',
  'exit-create-loan',
]);

const principal = ref(props.loan?.principal || 0);
const interestRate = ref(((props.loan?.annualRate || 0) * 100).toFixed(2));
const termInYears = ref(props.loan?.termInYears || 0);

const createButtonEnabled = computed(() => (
  [principal.value, interestRate.value, termInYears.value].every(
    (input) => !Number.isNaN(parseFloat(input)) && parseFloat(input) > 0,
  )
));

const clearCreate = () => {
  principal.value = null;
  interestRate.value = null;
  termInYears.value = null;
};

const emitCreate = () => {
  emits('create-loan', parseFloat(principal.value), parseFloat(interestRate.value) / 100, parseFloat(termInYears.value));
  clearCreate();
};

const emitExit = () => {
  emits('exit-create-loan');
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
