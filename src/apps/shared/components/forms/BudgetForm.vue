<script setup lang="ts">
import { computed, ref, watch, ComputedRef, Ref } from 'vue';

const props = defineProps<{
  modalId: string;
  title: string;
  label: string;
  initialAmount: number | null;
  saveButtonText: string;
  isActive: boolean;
  onExit: () => void;
  onSubmit: (amount: number) => void;
}>();

const amount: Ref<number | null> = ref(props.initialAmount);

const submitButtonEnabled: ComputedRef<boolean> = computed(
  () => amount.value !== null && !Number.isNaN(amount.value) && amount.value > 0
);

watch(
  () => props.initialAmount,
  (newAmount) => {
    amount.value = newAmount;
  },
  { immediate: true },
);

const exit = () => {
  amount.value = null;
  props.onExit();
};

const submit = () => {
  if (amount.value !== null) {
    props.onSubmit(amount.value);
    exit();
  }
};
</script>

<template>
  <base-modal
    :id="modalId"
    @exit="exit"
  >
    <template #header>
      <h2 :class="['pl-4']">{{ title }}</h2>
    </template>
    <template #headerActions>
      <base-button
        :class="['btn btn-circle btn-ghost']"
        @click="exit"
      >
        x
      </base-button>
    </template>
    <template #body>
      <div :class="['formInputs']">
        <div :class="['label']">
          <span :class="['label-text']">{{ label }}</span>
        </div>
        <input
          :id="`${modalId}-amount`"
          v-model.number="amount"
          :class="['input input-bordered input-secondary w-full max-ws']"
          type="number"
          :placeholder="label"
        >
      </div>
    </template>
    <template #actions>
      <base-button
        :disabled="!submitButtonEnabled"
        :class="'btn-success'"
        @click="submit"
      >
        {{ saveButtonText }}
      </base-button>
    </template>
  </base-modal>
</template>
