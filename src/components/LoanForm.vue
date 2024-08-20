<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps(['createButtonText', 'id', 'loan', 'title']);
const principal = ref(props.loan?.principal || 0);
const interestRate = ref((props.loan?.annualRate || 0) * 100);
const termInYears = ref(props.loan?.termInYears || 0);

const createButtonEnabled = computed(
  () => [principal.value, interestRate.value, termInYears.value].every(
    (input) => !Number.isNaN(input) && input > 0,
  ),
);

watch(
  () => props.loan,
  (newLoan) => {
    if (newLoan) {
      principal.value = newLoan.principal;
      interestRate.value = newLoan.annualRate * 100;
      termInYears.value = newLoan.termInYears;
    }
  },
  { immediate: true },
);

const emits = defineEmits(['create-loan', 'exit-create-loan']);

const clearCreate = () => {
  principal.value = null;
  interestRate.value = null;
  termInYears.value = null;
};

const emitCreate = () => {
  emits(
    'create-loan',
    principal.value,
    interestRate.value / 100,
    termInYears.value,
  );
  clearCreate();
};

const emitExit = () => {
  emits('exit-create-loan');
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
          <span :class="['label-text']">Principal</span>
        </div>
        <input :class="['input input-bordered input-secondary w-full max-ws']" v-model.number="principal" type="number"
          step="0.01" label="Principal" />
        <div :class="['label']">
          <span :class="['label-text']">Interest Rate</span>
        </div>
        <input :class="['input input-bordered input-secondary w-full max-ws']" v-model.number="interestRate"
          type="number" step="0.01" label="Interest Rate" />
        <div :class="['label']">
          <span :class="['label-text']">Term (In Years)</span>
        </div>
        <input :class="['input input-bordered input-secondary w-full max-ws']" v-model.number="termInYears"
          type="number" label="Term In Years" />
      </div>
    </template>
    <template #actions>
      <base-button @click="emitCreate" :disabled="!createButtonEnabled" :class="'btn-success'">
        {{ createButtonText }}
      </base-button>
    </template>
  </base-modal>
</template>
