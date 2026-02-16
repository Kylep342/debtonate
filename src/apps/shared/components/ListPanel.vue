<script setup lang="ts">
import { computed, ComputedRef } from 'vue';
import { Button, Menu } from '@/apps/shared/types/app';
import { useResize } from '@/apps/shared/composables/useResize';
import ManagementPanel from '@/apps/shared/components/ManagementPanel.vue';

const props = defineProps<{
  panelId: string;
  title: string;
  items: any[];
  createItem: () => void;
  pivotMenu: Menu;
  createText: string;
}>();

const { scrollContainer } = useResize();

const createButton: ComputedRef<Button> = computed(() => ({
  text: props.createText,
  onClick: props.createItem,
  classes: ['btn-sm', 'btn-success', 'text-center'],
}));
</script>

<template>
  <base-card :id="panelId" :class="['bg-base-100', 'w-90', 'flex-none']">
    <template #cardTitle>
      <ManagementPanel
        :button="createButton"
        :menu="pivotMenu"
        :title="title"
        :class="['border-b-2']"
      />
    </template>
    <template #cardBody>
      <div
        ref="scrollContainer"
        :class="['border-r-2', 'overflow-y-auto', 'flex', 'flex-col', 'min-h-0']"
      >
        <ul>
          <li v-for="item in items" :key="item.id">
            <slot name="item" :item="item"></slot>
          </li>
        </ul>
      </div>
    </template>
  </base-card>
</template>
