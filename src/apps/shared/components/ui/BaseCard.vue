<script setup lang="ts">
defineProps<{ bodyClasses?: string[] }>();
</script>

<template>
  <div :class="['card']">
    <slot name="cardTitle" />
    <div :class="['card-body', 'p-4', 'md:px-6', bodyClasses]">
      <slot name="cardBody" />
    </div>
    <slot name="cardActions" />
  </div>
</template>
