<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <div
    id="debtonate"
    :class="['font-mono', 'h-screen', 'overflow-hidden']"
  >
    <RouterView />
  </div>
</template>