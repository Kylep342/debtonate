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
    <template #headerActions>
      <base-button @click='emitExit' :class="['btn btn-circle btn-ghost']">
        x
      </base-button>
    </template>
    <template #body>
      <div :class="['formInputs']">
        <div :class="['label']">
          <span :class="['label-text']">Principal</span>
        </div>
        <input
          :class="['input input-bordered input-secondary w-full max-ws']"
          v-model='principal'
          type='number'
          label='Principal'
        />
        <div :class="['label']">
          <span :class="['label-text']">Interest</span>
        </div>
        <input
          :class="['input input-bordered input-secondary w-full max-ws']"
          v-model='interestRate'
          type='number'
          label='Interest'
        />
        <div :class="['label']">
          <span :class="['label-text']">Term</span>
        </div>
        <input
          :class="['input input-bordered input-secondary w-full max-ws']"
          v-model='termInYears'
          type='number'
          label='Term Length'
        />
      </div>
    </template>
    <template #actions>
      <base-button @click='emitCreate' :disabled='!createButtonEnabled'>
        {{ createButtonText }}
      </base-button>
    </template>
  </base-modal>
</template>
