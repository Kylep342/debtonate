<script setup lang="ts">
import { Button } from '@/apps/shard/types/app';

const props = defineProps<{
  buttons: Array<Button>,
  title: string,
}>();
</script>

<template>
  <div :class="['navbar']">
    <div :class="['flex-1']">
      <h2>{{ props.title }}</h2>
    </div>
    <div :class="['flex-none']">
      <div v-for="(button) in buttons" :key="button.text">
        <base-button :class="button.classes" @click="button.onClick">
          {{ button.text }}
        </base-button>
      </div>
    </div>
  </div>
</template>
