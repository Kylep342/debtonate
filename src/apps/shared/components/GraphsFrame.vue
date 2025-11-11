<script setup lang="ts">
import { computed, ref, watch, ComputedRef, Ref } from 'vue';

import constants from '@/apps/shared/constants/constants';
import { Button } from '@/apps/shared/types/app';
import { GraphConfig, LineGraphContent } from '@/apps/shared/types/graph';
import { usePivot } from '@/apps/shared/composables/usePivot';

const props = defineProps<{
  graphs: Record<string, GraphConfig<LineGraphContent>>;
  pivotItems: any[];
  watchedItems: any[];
  getItemName: (id: string) => string;
  initialItemId: string;
  initialGraphId: string;
}>();

const {
  viewedItemId,
  isViewedItemId,
  setViewedItemId
} = usePivot(props.initialItemId);

const viewedGraphId: Ref<string> = ref(props.initialGraphId);
const activeGraph: ComputedRef<GraphConfig<LineGraphContent>> = computed(() => props.graphs[viewedGraphId.value]);
const setViewedGraphId = (graphId: string) => viewedGraphId.value = graphId;

const buttons: ComputedRef<Button[]> = computed(() => Object.keys(props.graphs).map((graphId) => ({
  text: graphId,
  onClick: () => setViewedGraphId(graphId),
})));

watch(() => props.watchedItems, (newItems) => {
  if (!newItems.map((item) => item.id).includes(viewedItemId.value)) {
    setViewedItemId(props.initialItemId);
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
