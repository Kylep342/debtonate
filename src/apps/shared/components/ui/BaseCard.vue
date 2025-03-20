<script setup lang="ts">
defineProps<{ bodyClasses?: Array<string> }>();
</script>

<template>
  <div :class="['card']">
    <slot name="cardTitle" />
    <div :class="['card-body', 'p-4', bodyClasses]">
      <slot name="cardBody" />
    </div>
    <slot name="cardActions" />
  </div>
</template>
