<script setup lang="ts">
import { computed, ComputedRef, Ref } from 'vue';
import { Button, Menu } from '@/apps/shared/types/app';
import ManagementPanel from '@/apps/shared/components/ManagementPanel.vue';

const props = defineProps<{
  panelId: string;
  title: string;
  items: any[];
  createItem: () => void;
  pivotMenu: Menu;
  createText: string;
  activeTab?: Ref<string>;
}>();

const createButton: ComputedRef<Button> = computed(() => ({
  text: props.createText,
  onClick: props.createItem,
  classes: ['btn-sm', 'btn-success', 'text-center'],
}));
</script>

<template>
  <base-card
    :id="panelId"
    :class="['bg-base-100', 'w-90', 'flex-none', 'h-full', 'min-h-0', 'flex', 'flex-col', 'min-w-0', 'max-w-full']"
    :body-classes="['p-2', 'md:px-3', 'overflow-hidden', 'flex', 'flex-col', 'flex-1', 'min-h-0', 'w-full', 'max-w-full']"
  >
    <template #cardTitle>
      <ManagementPanel
        :button="createButton"
        :menu="pivotMenu"
        :title="title"
        :class="['border-b-2', 'flex-none']"
      />
    </template>
    <template #cardBody>
      <div
        :class="['border-r-2', 'overflow-y-auto', 'overflow-x-hidden', 'flex-1', 'min-h-0', 'w-full', 'max-w-full']"
        style="-webkit-overflow-scrolling: touch;"
      >
        <ul class="w-full min-w-0">
          <li
            v-for="item in items"
            :key="item.id"
            class="w-full min-w-0 mb-2"
          >
            <slot
              name="item"
              :item="item"
            />
          </li>
        </ul>
      </div>
    </template>
  </base-card>
</template>
