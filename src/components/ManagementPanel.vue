<script setup>
const props = defineProps(['createFunction', 'title']);
</script>

<template>
  <div :class="['navbar']">
    <div :class="['flex-1']">
      <h2>{{ props.title }}</h2>
    </div>
    <div :class="['flex-none']">
      <base-button :class="['btn-success']" @click="props.createFunction">Create</base-button>
    </div>
  </div>
</template>
