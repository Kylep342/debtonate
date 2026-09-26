<script setup lang="ts">
import { computed, ref, watch, ComputedRef, Ref } from 'vue';

import { Button } from '@/apps/shared/types/app';
import { GraphConfig, LineGraphContent } from '@/apps/shared/types/graph';
import { usePivot } from '@/apps/shared/composables/usePivot';
import BaseGraph from '@/apps/shared/components/ui/BaseGraph.vue';
import BaseMenu from '@/apps/shared/components/ui/BaseMenu.vue';

const props = withDefaults(
  defineProps<{
    graphs: Record<string, GraphConfig<LineGraphContent>>;
    extraViewIds?: string[];
    pivotItems: any[];
    watchedItems: any[];
    getItemName: (id: string) => string;
    initialItemId: string;
    initialGraphId: string;
    pivotLabel?: string;
  }>(),
  {
    extraViewIds: () => [],
    pivotLabel: 'Item',
  }
);

const emit = defineEmits<{
  (e: 'update:viewed-item-id', id: string): void;
}>();

const {
  viewedItemId,
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

const graphButtons: ComputedRef<Button[]> = computed(() => {
  const gButtons = Object.keys(props.graphs).map((graphId) => ({
    text: graphId,
    onClick: () => setViewedGraphId(graphId),
  }));

  const extraButtons = (props.extraViewIds || []).map((viewId) => ({
    text: viewId,
    onClick: () => setViewedGraphId(viewId),
  }));

  return [...gButtons, ...extraButtons];
});

const pivotButtons: ComputedRef<Button[]> = computed(() =>
  props.pivotItems.map((item) => ({
    text: props.getItemName(item.id),
    onClick: () => setViewedItemId(item.id),
  }))
);

watch(() => props.watchedItems, (newItems) => {
  if (!newItems.map((item) => item.id).includes(viewedItemId.value)) {
    setViewedItemId(props.initialItemId);
  }
});
</script>

<template>
  <div>
    <div class="card-actions p-2 sm:p-4 border-b border-base-content/10">
      <div class="flex flex-wrap items-center justify-between w-full min-w-0 gap-2">
        <!-- Controls Group: Graph selector, Entity pivot selector, Extra pivots -->
        <div class="flex flex-wrap items-center gap-2 min-w-0">
          <h2 class="cardHeaderTitle font-bold text-base sm:text-lg tracking-tight sr-only">
            {{ viewedGraphId }}
          </h2>
          <!-- Graph Selection Dropdown Button -->
          <base-menu
            :text="`Graph: ${viewedGraphId}`"
            :buttons="graphButtons"
            :classes="['btn-secondary', 'btn-sm']"
            align="start"
            style="filter: brightness(0.9);"
          />
          <!-- Pivot Entity Dropdown Button (e.g. Loan / Instrument / Budget) -->
          <base-menu
            v-if="!isExtraView && pivotItems && pivotItems.length > 0 && viewedItemId"
            :text="`${pivotLabel}: ${getItemName(viewedItemId)}`"
            :buttons="pivotButtons"
            :classes="['btn-outline', 'btn-sm']"
            align="start"
          />
          <!-- Additional Pivot Slot (e.g. Career Budget in Investigate) -->
          <slot name="extraPivot" />
        </div>
      </div>
    </div>

    <!-- Content: Extra View or Base Graph -->
    <div class="tabframe w-full">
      <div
        v-if="isExtraView"
        class="p-4"
      >
        <slot
          :name="`view-${viewedGraphId}`"
          :viewed-item-id="viewedItemId"
        />
      </div>
      <div
        v-else
        class="p-2 sm:p-4"
      >
        <base-graph
          v-if="activeGraph && viewedItemId"
          :key="`${viewedGraphId}-${viewedItemId}`"
          :graph="activeGraph"
          :anchor-id="viewedItemId"
        />
      </div>
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
