import { ref, Ref, watch, nextTick } from 'vue';

import { useEvent} from '@/apps/shared/composables/useEvent';
import { fillHeight } from '@/apps/shared/functions/viewport';

export function useResize(callOnMount: boolean=true, dependency?: Ref<any>) {
  const scrollContainer: Ref = ref(null);

  const resize = (): void => {
    if (scrollContainer.value) {
      scrollContainer.value.style.maxHeight = `${fillHeight(scrollContainer, 26)}px`;
    }
  }

  useEvent(window, 'resize', resize, callOnMount);

  if (dependency) {
    watch(dependency, () => {
      nextTick(() => {
        resize();
      });
    });
  }

  return { scrollContainer }
}
