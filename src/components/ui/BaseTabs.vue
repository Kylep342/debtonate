<script setup>
import { ref } from 'vue';

const props = defineProps({
  initialItem: [String, Number],
  getItemName: Function,
  pivot: Array,
});

const viewedItemId = ref(props.initialItem);
const flexBasis = `basis-1/${props.pivot.length}`;

const buttonText = (itemId) => props.getItemName(itemId);

const setViewedItemId = (value) => {
  viewedItemId.value = value;
};

</script>

<template>
  <div>
    <div v-for="item in pivot"
:key="item.id"
      :class="['join-item', flexBasis, 'w-full', { 'border-t-2': item.id === viewedItemId }]">
      <base-button :class="['btn-ghost', 'w-full']"
@click=setViewedItemId(item.id)>
        {{ buttonText(item.id) }}
      </base-button>
    </div>
    <slot name="tab-content"></slot>
  </div>
</template>
