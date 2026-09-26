<script setup lang="ts">
import { computed, ref, watch, ComputedRef, Ref } from 'vue';

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
      <div class="flex items-center justify-between w-full min-w-0">
        <h2 class="cardHeaderTitle font-bold text-base sm:text-lg tracking-tight sr-only">
          {{ viewedGraphId }}
        </h2>
        <base-menu
          :text="viewedGraphId"
          :buttons="buttons"
          :classes="['btn-secondary', 'btn-sm']"
          align="start"
          style="filter: brightness(0.9);"
        />
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
