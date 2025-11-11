import { ref, type Ref } from 'vue';

export function usePivot(initialId = null) {
  const viewedItemId: Ref<string|null> = ref(initialId);

  const isViewedItemId = (id: string) => id === viewedItemId.value;

  const setViewedItemId = (id: string) => viewedItemId.value = id;

  return { viewedItemId, isViewedItemId, setViewedItemId }
}
