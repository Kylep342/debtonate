<script setup>
const props = defineProps([
  'createFunction',
  'panelId',
  'panelTitle',
]);
</script>

<!-- TODO: Add show/hide functionality for the loan and budget panels -->
<!-- TODO: explore width containers in DaisyUI (e.g. split widthy 20%/20%/60%)-->

<template>
  <div :id='props.panelId'>
    <div :class="['navbar']">
      <div :class="['flex-1']">
        <h2>{{ props.panelTitle }}</h2>
      </div>
      <div :class="['flex-none']">
        <base-button @click='props.createFunction'>+</base-button>
      </div>
      <!-- <div :class="['flex-none']">
        <base-button @click='props.createFunction'>+</base-button>
      </div>
      <div :class="['flex-none']">
        <base-button @click='props.createFunction'>+</base-button>
      </div> -->
    </div>
  </div>
</template>
