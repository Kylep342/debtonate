<script setup lang="ts">
import RefinancingTable from '@/components/RefinancingTable.vue';
import useCoreStore from '@/stores/core';

defineProps<{ parentId: string }>();

const coreState = useCoreStore();

</script>

<template>
  <div>
    <RefinancingTable
      :parent-id="parentId"
      :scenarios="coreState.refinancingScenarios[parentId]"
      :schedules="coreState.refinancingSchedules[parentId]"
    />
  </div>
</template>
