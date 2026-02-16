<script setup lang="ts">
import { computed, ref, watch, ComputedRef } from 'vue';
import { FormField } from '@/apps/shared/types/app';

const props = defineProps<{
  modalId: string;
  title: string;
  fields: FormField[];
  initialValues: Record<string, any>;
  saveButtonText: string;
  isActive: boolean;
  onExit: () => void;
  onSubmit: (values: Record<string, any>) => void;
}>();

const formData = ref<Record<string, any>>({ ...props.initialValues });

const submitButtonEnabled: ComputedRef<boolean> = computed(() => {
  return props.fields.every(field => {
    if (!field.required) return true;
    const value = formData.value[field.key];
    if (field.type === 'number') {
      return value !== null && !Number.isNaN(value) && value > 0;
    }
    return value !== null && value !== '';
  });
});

watch(
  () => props.initialValues,
  (newValues) => {
    formData.value = { ...newValues };
  },
  { immediate: true, deep: true },
);

const exit = () => {
  formData.value = {};
  props.onExit();
};

const submit = () => {
  props.onSubmit(formData.value);
  exit();
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
        <div v-for="field in fields" :key="field.key">
          <div :class="['label']">
            <span :class="['label-text']">{{ field.label }}</span>
          </div>
          <input
            :id="`${modalId}-${field.key}`"
            v-model="formData[field.key]"
            :class="['input input-bordered input-secondary w-full max-ws']"
            :type="field.type"
            :step="field.step"
            :placeholder="field.label"
          >
        </div>
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
