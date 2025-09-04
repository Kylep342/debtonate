<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { Button } from '@/apps/shared/types/app';
import { GraphConfig } from '@/apps/shared/types/graph';
import { usePivot } from '@/apps/shared/composables/usePivot';

const props = defineProps<{
  graphs: Record<string, GraphConfig>;
  pivotItems: any[];
  watchedItems: any[];
  getItemName: (id: string) => string;
  constants: { TOTALS: string; GRAPHS: string; BTN_SELECT: string };
  initialGraphId: string;
}>();

const {
  viewedItemId,
  isViewedItemId,
  setViewedItemId
} = usePivot(props.constants.TOTALS);

const viewedGraphId = ref<string>(props.initialGraphId);
const activeGraph = computed<GraphConfig>(() => props.graphs[viewedGraphId.value]);
const setViewedGraphId = (graphId: string) => viewedGraphId.value = graphId;

const buttons = computed<Button[]>(() => Object.keys(props.graphs).map((graphId) => ({
  text: graphId,
  onClick: () => setViewedGraphId(graphId),
})));

watch(() => props.watchedItems, (newItems) => {
  if (!newItems.map((item) => item.id).includes(viewedItemId.value)) {
    setViewedItemId(props.constants.TOTALS);
  }
});
</script>

<template>
  <div>
    <div :class="['card-actions', 'flow-root', 'p-0']">
      <div :class="['flex', 'justify-between', 'pr-4']">
        <h2 :class="['cardHeaderTitle', 'float-left', 'p-4']">
          {{ constants.GRAPHS }} - {{ viewedGraphId }}
        </h2>
        <base-menu :text="constants.BTN_SELECT" :buttons="buttons" />
      </div>
    </div>
    <div :class="['tabframe', 'w-fit']">
      <base-tabs
        :get-item-name="getItemName"
        :pivot="pivotItems"
        :is-viewed-item-id="isViewedItemId"
        :set-viewed-item-id="setViewedItemId"
      >
        <template #tabContent>
          <base-graph
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
  padding-left: 4rem; /* Use a consistent padding */
  overflow: visible;
}
</style>
