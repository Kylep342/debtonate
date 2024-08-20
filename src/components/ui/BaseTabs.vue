<script setup>
import { ref } from 'vue';

const props = defineProps({
  parentId: String,
  initialItem: [String, Number],
  getItemName: Function,
  pivot: Array,
  anchor: [String, Number],
});

const viewedItemId = ref(props.initialItem);
const flexBasis = `basis-1/${props.pivot.length}`;

const buttonText = (itemId) => props.getItemName(itemId);

const setViewedItemId = (value) => {
  viewedItemId.value = value;
};

const generateKey = (...args) => args.map((arg) => arg.id || arg).join('');
</script>

<template>
  <div>
    <div v-for="item in pivot" :key="generateKey(anchor, item)"
      :class="['join-item', flexBasis, 'w-full', { 'border-t-2': item.id === viewedItemId }]">
      <base-button :class="['btn-ghost', 'w-full']" @click=setViewedItemId(item.id)>
        {{ buttonText(item.id) }}
      </base-button>
    </div>
    <slot name="tab-content" :item="item">
    </slot>
  </div>
</template>
