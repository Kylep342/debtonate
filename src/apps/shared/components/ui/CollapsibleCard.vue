<script setup lang="ts">
import { ref, type Ref } from 'vue';
import BaseCard from '@/apps/shared/components/ui/BaseCard.vue';

defineProps<{ bodyClasses?: string[] }>();
const isCollapsed: Ref<boolean> = ref(false);

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const collapse = () => {
  isCollapsed.value = true;
};

const expand = () => {
  isCollapsed.value = false;
};

defineExpose({
  collapse,
  expand,
});
</script>

<template>
  <BaseCard :body-classes="bodyClasses">
    <template #cardTitle>
      <div class="flex items-center justify-between">
        <span>
          <slot name="cardTitle" />
        </span>
        <div :class="['card-actions', 'justify-end', 'p-4']">
          <slot name="cardTitleActions" />
          <base-button :class="['btn-ghost']" @click="toggleCollapse">
            {{ isCollapsed ? '+' : '-' }}
          </base-button>
        </div>
      </div>
    </template>
    <template v-if="!isCollapsed" #cardBody>
      <slot name="cardBody" />
    </template>
    <template v-if="!isCollapsed" #cardActions>
      <slot name="cardActions" />
    </template>
  </BaseCard>
</template>
