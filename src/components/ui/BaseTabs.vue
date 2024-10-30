<script setup>
const props = defineProps({
  getItemName: Function,
  pivot: Array,
  isViewedItemId: Function,
  setViewedItemId: Function,
});

const flexBasis = `basis-1/${props.pivot.length}`;
</script>

<template>
  <div>
    <div :class="['tabs', 'flex', 'flex-row', 'join', 'w-full', 'flex-grow']">
      <div
        v-for="item in pivot"
        :key="item.id"
        :class="['join-item', flexBasis, 'w-full', { 'border-t-2': isViewedItemId(item.id) }]"
      >
        <base-button
          :class="['btn-ghost', 'w-full']"
          @click="setViewedItemId(item.id)"
        >
          {{ getItemName(item.id) }}
        </base-button>
      </div>
    </div>
    <slot name="tabContent" />
  </div>
</template>
