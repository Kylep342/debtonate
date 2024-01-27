<script setup>
import {
  computed,
  defineEmits,
  defineProps,
  ref,
} from 'vue';

const props = defineProps(['title', 'createButtonText', 'loan']);
const emits = defineEmits(['create-loan', 'exit-create-loan']);

const principal = ref(props.loan?.principal || null);
const interestRate = ref(((props.loan?.annualRate || null) * 100).toFixed(2) || null);
const termInYears = ref(props.loan?.termInYears || null);

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
