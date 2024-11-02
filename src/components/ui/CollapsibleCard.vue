<script setup>
import { ref } from 'vue';
import BaseCard from './BaseCard.vue';

const props = defineProps(['bodyClasses']);
const isCollapsed = ref(false);

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<template>
  <BaseCard :bodyClasses="props.bodyClasses">
    <template #cardTitle>
      <div class="flex items-center justify-between">
        <span><slot name="cardTitle" /></span>
        <div :class="['card-actions', 'justify-end', 'p-4']">
          <slot name="cardTitleActions" />
          <base-button @click="toggleCollapse" :class="['btn-ghost']">
            {{ isCollapsed ? '+' : '-' }}
          </base-button>
        </div>
      </div>
    </template>

    <template #cardBody v-if="!isCollapsed">
      <slot name="cardBody" />
    </template>

    <template #cardActions v-if="!isCollapsed">
      <slot name="cardActions" />
    </template>
  </BaseCard>
</template>
