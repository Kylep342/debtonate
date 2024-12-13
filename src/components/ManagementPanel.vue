<script setup>
const props = defineProps(['buttons', 'title']);

const classes = ['btn-success', 'text-center']
</script>

<template>
  <div :class="['navbar']">
    <div :class="['flex-1']">
      <h2>{{ props.title }}</h2>
    </div>
    <div :class="['flex-none']">
      <div
        v-for="(button) in buttons"
        :key="button.text"
      >
        <base-button
          :class="classes"
          @click="button.onClick"
        >
          {{ button.text }}
        </base-button>
      </div>
    </div>
  </div>
</template>
