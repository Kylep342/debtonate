<script setup lang="ts">
import { computed, ComputedRef } from 'vue';

const props = defineProps<{
  getItemName: (id: string) => string,
  pivot: Array<any>,
  isViewedItemId: (id: string) => boolean,
  setViewedItemId: (id: string) => void,
}>();

const flexBasis: ComputedRef<string> = computed(() => props.pivot ? `basis-1/${props.pivot!.length}` : 'basis-1');
const tabStyle = (id: string): string => props.isViewedItemId(id) ? 'btn-secondary' : 'btn-ghost';
</script>

<template>
  <div>
    <div :class="['tabs', 'flex', 'flex-row', 'join', 'w-full', 'flex-grow', 'p-4']">
      <div v-for="item in pivot" :key="item.id" :class="['join-item', flexBasis, 'w-full']">
        <base-button :class="[
          'btn-sm',
          'w-full',
          tabStyle(item.id),
          { 'shadow-lg': isViewedItemId(item.id) },
        ]" @click="setViewedItemId(item.id)">
          {{ getItemName(item.id) }}
        </base-button>
      </div>
    </div>
    <slot name="tabContent" />
  </div>
</template>
