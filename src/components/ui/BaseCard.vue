<script setup>
const props = defineProps(['bodyClasses']);
</script>

<template>
  <div :class="['card']">
    <slot name="cardTitle" />
    <div :class="['card-body', 'p-4', props.bodyClasses]">
      <slot name="cardBody" />
    </div>
    <slot name="cardActions" />
  </div>
</template>
