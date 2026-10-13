import {
  getCurrentInstance,
  onUnmounted,
  ref,
  Ref,
  watch,
  WatchSource,
} from 'vue';
import { useGlobalOptionsStore } from '@/apps/shared/stores/globalOptions';

export interface UseAutoSaveOptions {
  saveFn: () => void;
  watchedSources: WatchSource<any>[];
  debounceMs?: number;
  isPlanLoadedFromUrl?: Ref<boolean>;
}

export function useAutoSave(options: UseAutoSaveOptions) {
  const globalOptions = useGlobalOptionsStore();
  const debounceMs = options.debounceMs ?? 400;
  const isSaving: Ref<boolean> = ref(false);
  let timer: ReturnType<typeof setTimeout> | null = null;

  const canSave = (): boolean => {
    if (!globalOptions.autoSaveState) return false;
    if (
      typeof window !== 'undefined'
      && window.location.hash
      && window.location.hash.includes('plan=')
    ) {
      return false;
    }
    if (options.isPlanLoadedFromUrl?.value) {
      return false;
    }
    return true;
  };

  const triggerSave = (): void => {
    if (!canSave()) return;

    if (timer) clearTimeout(timer);
    isSaving.value = true;
    timer = setTimeout(() => {
      try {
        options.saveFn();
      } finally {
        isSaving.value = false;
        timer = null;
      }
    }, debounceMs);
  };

  const cancelPendingSave = (): void => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
      isSaving.value = false;
    }
  };

  watch(
    options.watchedSources,
    () => {
      triggerSave();
    },
    { deep: true },
  );

  watch(
    () => globalOptions.autoSaveState,
    (newValue, oldValue) => {
      if (newValue && !oldValue) {
        if (canSave()) {
          options.saveFn();
        }
      } else if (!newValue) {
        cancelPendingSave();
      }
    },
  );

  if (getCurrentInstance()) {
    onUnmounted(() => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
        if (canSave()) {
          options.saveFn();
        }
      }
    });
  }

  return {
    cancelPendingSave,
    isSaving,
    triggerSave,
  };
}
