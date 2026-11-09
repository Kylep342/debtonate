<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ bodyClasses?: string[] }>();

const hasCustomPadding = computed(() =>
  (props.bodyClasses || []).some((cls) =>
    /^(?:!?(?:p|px|py|pt|pb|pl|pr)-|(?:sm|md|lg|xl):!?(?:p|px|py|pt|pb|pl|pr)-)/.test(cls)
  )
);
</script>

<template>
  <div :class="['card', 'min-w-0', 'max-w-full']">
    <slot name="cardTitle" />
    <div
      :class="[
        'card-body',
        ...(hasCustomPadding ? [] : ['p-4', 'md:px-6']),
        'min-w-0',
        'max-w-full',
        bodyClasses,
      ]"
    >
      <slot name="cardBody" />
    </div>
    <slot name="cardActions" />
  </div>
</template>
