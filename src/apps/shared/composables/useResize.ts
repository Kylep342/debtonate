import { ref, Ref } from 'vue';

import { useEvent} from '@/apps/shared/composables/useEvent';
import { fillHeight } from '@/apps/shared/functions/viewport';

export function useResize(callOnMount: boolean=true) {
  const scrollContainer: Ref = ref(null);

  const resize = () => {
    scrollContainer.value.style.maxHeight = `${fillHeight(scrollContainer, 26)}px`;
  }

  useEvent(window, 'resize', resize, callOnMount);

  return { scrollContainer }
}
