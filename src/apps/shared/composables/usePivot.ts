import { ref } from 'vue';

export function usePivot(initialId = null) {
  const viewedItemId = ref<string | null>(initialId);

  const isViewedItemId = (id) => id === viewedItemId.value;

  const setViewedItemId = (id) => viewedItemId.value = id;

  return { viewedItemId, isViewedItemId, setViewedItemId }
}
