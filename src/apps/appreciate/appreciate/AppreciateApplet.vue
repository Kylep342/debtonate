<script setup lang="ts">
import GraphsPanel from '@/apps/appreciate/components/GraphsPanel.vue';
</script>

<template>
  <div :class="['m-4', 'flex-1', 'flex', 'flex-col', 'items-center']">
    <div :class="['w-full', 'max-w-6xl']">
      <div :class="['header', 'flex', 'justify-between', 'items-center', 'pr-4']">
        <h2>Investment Analysis</h2>
      </div>
      <GraphsPanel />
    </div>
  </div>
</template>
