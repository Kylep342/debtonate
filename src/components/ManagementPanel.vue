<script setup>
const props = defineProps([
  'createFunction',
  'panelId',
  'panelTitle',
]);
</script>

<template>
  <div :id='props.panelId'>
    <div :class="['panelHeader', 'header']">
      <h2 :class="['panelHeaderTitle']">{{ props.panelTitle }}</h2>
      <div :class="['panelheaderSubSection']">
        <button @click='props.createFunction'>+</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
