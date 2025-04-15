<script setup lang="ts">
import { Button, Menu } from '@/apps/shared/types/app';

const props = defineProps<{
  button: Button,
  title: string,
  menu: Menu,
}>();
</script>

<template>
  <div :class="['navbar']">
    <div :class="['flex-1']">
      <h2>{{ props.title }}</h2>
    </div>
    <div :class="['flex-none']">
      <base-menu :text="menu.text" :buttons="menu.buttons" />
      <base-button :class="button.classes" @click="button.onClick">
        {{ button.text }}
      </base-button>
    </div>
  </div>
</template>
