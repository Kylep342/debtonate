<template>
  <span class="color-dot" :style="{ backgroundColor: color }" />
</template>

<script setup lang="ts">
defineProps<{
  color: string
}>();
</script>

<style scoped>
.color-dot {
  display: inline-block;
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 50%;
  margin-right: 0.4rem;
  vertical-align: middle;
  position: relative;
  top: -0.05rem;
}
</style>
