<script setup lang="ts">
import { Button } from '@/apps/shared/types/app';

defineProps<{
  text: string,
  buttons: Array<Button>
}>();
</script>

<template>
  <div :class="['dropdown', 'dropdown-bottom', 'dropdown-end']">
    <base-button>{{ text }}</base-button>
    <ul tabIndex="{0}"
      :class="['dropdown-content', 'menu', 'bg-base-100', 'rounded-box', 'z-[1]', 'w-fit', 'p-2', 'shadow']">
      <li v-for="(button) in buttons" :key="button.text" @click.prevent="button.onClick()">
        <a>{{ button.text }}</a>
      </li>
    </ul>
  </div>
</template>
