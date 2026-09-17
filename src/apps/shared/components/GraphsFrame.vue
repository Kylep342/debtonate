<script setup lang="ts">
import { computed, ref, watch, ComputedRef, Ref } from 'vue';

import constants from '@/apps/shared/constants/constants';
import { Button } from '@/apps/shared/types/app';
import { GraphConfig, LineGraphContent } from '@/apps/shared/types/graph';
import { usePivot } from '@/apps/shared/composables/usePivot';

const props = defineProps<{
  graphs: Record<string, GraphConfig<LineGraphContent>>;
  extraViewIds?: string[];
  pivotItems: any[];
  watchedItems: any[];
  getItemName: (id: string) => string;
  initialItemId: string;
  initialGraphId: string;
}>();

const emit = defineEmits<{
  (e: 'update:viewed-item-id', id: string): void;
}>();

const {
  viewedItemId,
  isViewedItemId,
  setViewedItemId
} = usePivot(props.initialItemId);

watch(viewedItemId, (newId) => {
  if (newId) {
    emit('update:viewed-item-id', newId);
  }
});

const viewedGraphId: Ref<string> = ref(props.initialGraphId);
const activeGraph: ComputedRef<GraphConfig<LineGraphContent> | undefined> = computed(() => props.graphs[viewedGraphId.value]);
const isExtraView = computed(() => props.extraViewIds?.includes(viewedGraphId.value));

const setViewedGraphId = (graphId: string) => viewedGraphId.value = graphId;

const buttons: ComputedRef<Button[]> = computed(() => {
  const graphButtons = Object.keys(props.graphs).map((graphId) => ({
    text: graphId,
    onClick: () => setViewedGraphId(graphId),
  }));

  const extraButtons = (props.extraViewIds || []).map((viewId) => ({
    text: viewId,
    onClick: () => setViewedGraphId(viewId),
  }));

  return [...graphButtons, ...extraButtons];
});

watch(() => props.watchedItems, (newItems) => {
  if (!newItems.map((item) => item.id).includes(viewedItemId.value)) {
    setViewedItemId(props.initialItemId);
  }
});
</script>

<template>
  <div>
    <div class="card-actions p-2 sm:p-4 border-b border-base-content/10">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5 w-full">
        <div class="flex items-center justify-between w-full md:w-auto">
          <h2 class="cardHeaderTitle font-bold text-base sm:text-lg tracking-tight">
            {{ viewedGraphId }}
          </h2>
          <!-- Mobile Dropdown Menu -->
          <div class="md:hidden">
            <base-menu
              :text="constants.BTN_SELECT"
              :buttons="buttons"
              :classes="['btn-sm']"
            />
          </div>
        </div>

        <!-- Desktop / Tablet Segmented Pill Controls -->
        <div class="hidden md:flex flex-wrap items-center gap-1.5">
          <button
            v-for="btn in buttons"
            :key="btn.text"
            type="button"
            class="btn btn-xs sm:btn-sm transition-all rounded-full font-medium"
            :class="[
              viewedGraphId === btn.text
                ? 'btn-primary shadow-sm'
                : 'btn-ghost hover:bg-base-200 text-base-content/80'
            ]"
            @click="() => btn.onClick()"
          >
            {{ btn.text }}
          </button>
        </div>
      </div>
    </div>
    <div :class="['tabframe', 'w-full']">
      <div
        v-if="isExtraView"
        :class="['p-4']"
      >
        <slot
          :name="`view-${viewedGraphId}`"
          :viewed-item-id="viewedItemId"
        />
      </div>
      <base-tabs
        v-else
        :get-item-name="getItemName"
        :pivot="pivotItems"
        :is-viewed-item-id="isViewedItemId"
        :set-viewed-item-id="setViewedItemId"
      >
        <template #tabContent>
          <base-graph
            v-if="activeGraph"
            :key="viewedItemId"
            :graph="activeGraph"
            :anchor-id="viewedItemId"
          />
        </template>
      </base-tabs>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  padding-left: 4rem;
  overflow: visible;
}
</style>
