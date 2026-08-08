<script setup lang="ts">
import { Button, Menu } from '@/apps/shared/types/app';

const props = defineProps<{
  button: Button,
  title: string,
  menu: Menu,
}>();
</script>

<template>
  <div :class="['navbar', 'min-h-0', 'py-2', 'px-3', 'w-full', 'max-w-full', 'overflow-hidden']">
    <div :class="['flex-1', 'min-w-0', 'overflow-hidden']">
      <h2 class="truncate font-semibold text-lg">{{ props.title }}</h2>
    </div>
    <div :class="['flex-none', 'flex', 'gap-1', 'items-center']">
      <base-menu :text="menu.text" :buttons="menu.buttons" :classes="menu.classes"/>
      <base-button :class="button.classes" @click="button.onClick">
        {{ button.text }}
      </base-button>
    </div>
  </div>
</template>
