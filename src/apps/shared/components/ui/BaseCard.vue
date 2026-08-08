<script setup lang="ts">
defineProps<{ bodyClasses?: string[] }>();
</script>

<template>
  <div :class="['card', 'min-w-0', 'max-w-full']">
    <slot name="cardTitle" />
    <div :class="['card-body', 'p-4', 'md:px-6', 'min-w-0', 'max-w-full', bodyClasses]">
      <slot name="cardBody" />
    </div>
    <slot name="cardActions" />
  </div>
</template>
