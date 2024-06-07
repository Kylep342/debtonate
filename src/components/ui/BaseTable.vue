<script setup>
const props = defineProps(['size']);
</script>

<template>
  <div :class="['overflow-x-auto']">
    <table :class="['table', 'table-pin-rows', props.size]">
      <slot name="header"></slot>
      <slot name="body"></slot>
      <slot name="footer"></slot>
    </table>
  </div>
</template>
