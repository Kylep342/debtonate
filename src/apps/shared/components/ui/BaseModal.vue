<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    id: string;
    bodyClasses?: string[];
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | 'fit';
  }>(),
  {
    bodyClasses: () => [],
    maxWidth: 'xl',
  }
);

defineEmits<{
  (e: 'exit'): void;
}>();

const maxWidthClass = computed(() => {
  switch (props.maxWidth) {
    case 'sm':
      return 'max-w-sm';
    case 'md':
      return 'max-w-md';
    case 'lg':
      return 'max-w-lg';
    case 'xl':
      return 'max-w-xl';
    case '2xl':
      return 'max-w-2xl';
    case '3xl':
      return 'max-w-3xl';
    case '4xl':
      return 'max-w-4xl';
    case '5xl':
      return 'max-w-5xl';
    case 'fit':
      return 'max-w-fit';
    default:
      return 'max-w-xl';
  }
});
</script>

<template>
  <dialog
    :id="id"
    :class="['modal', 'modal-bottom', 'sm:modal-middle', 'backdrop-blur-sm']"
    @close="$emit('exit')"
  >
    <div
      :class="[
        'modal-box',
        'p-0',
        'flex',
        'flex-col',
        'w-11/12',
        'sm:w-full',
        maxWidthClass,
        'max-h-[90vh]',
        'min-w-0',
        'overflow-hidden',
        'rounded-2xl',
        'border',
        'border-base-content/10',
        'shadow-2xl',
        'bg-base-100',
        'translate-y-0',
      ]"
    >
      <base-card
        :class="['overflow-hidden', 'flex-1', 'flex', 'flex-col', 'min-h-0', 'h-full', 'w-full', 'max-w-full', 'bg-transparent', 'shadow-none']"
        :body-classes="['overflow-y-auto', 'overflow-x-hidden', 'flex-1', 'min-h-0', 'w-full', 'max-w-full', ...(bodyClasses || [])]"
        style="-webkit-overflow-scrolling: touch;"
      >
        <template #cardTitle>
          <header class="navbar bg-secondary px-4 sm:px-6 py-3.5 sm:py-4 border-b border-base-content/10 min-h-0 shrink-0">
            <div class="flex-1 min-w-0">
              <slot name="header" />
            </div>
            <div class="modal-action flex-none mt-0">
              <menu class="flex items-center m-0 p-0">
                <slot name="headerActions" />
              </menu>
            </div>
          </header>
          <div
            v-if="$slots.subHeader"
            class="px-3 sm:px-6 py-2 bg-base-100 border-b border-base-content/10 shrink-0"
          >
            <slot name="subHeader" />
          </div>
        </template>
        <template #cardBody>
          <slot name="body" />
        </template>
        <template #cardActions>
          <div
            v-if="$slots.actions"
            class="card-actions justify-end px-4 sm:px-6 py-3 bg-base-200/30 border-t border-base-content/10 shrink-0"
          >
            <menu class="flex items-center gap-2 m-0 p-0">
              <slot name="actions" />
            </menu>
          </div>
        </template>
      </base-card>
    </div>
  </dialog>
</template>
