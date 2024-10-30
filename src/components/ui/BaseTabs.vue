<script setup>
const props = defineProps({
  initialItemId: [String],
  getItemName: Function,
  pivot: Array,
  isViewedItemId: Function,
  setViewedItemId: Function,
});

const flexBasis = `basis-1/${props.pivot.length}`;

const buttonText = (itemId) => props.getItemName(itemId);
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
          {{ buttonText(item.id) }}
        </base-button>
      </div>
    </div>
    <slot name="tabContent" />
  </div>
</template>
