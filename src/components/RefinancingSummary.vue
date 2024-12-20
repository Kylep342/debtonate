<script setup>
// import { ref } from 'vue';

import RefinancingTable from './RefinancingTable.vue';
import useCoreStore from '../stores/core';

defineProps(['parentId']);

const coreState = useCoreStore();

</script>

<template>
  <div>
    <RefinancingTable
      :parent-id="parentId"
      :scenarios="coreState.refinancingScenarios[parentId]"
    />
  </div>
</template>
