import { ref } from 'vue';

import { useEvent} from '@/apps/shared/composables/useEvent';
import { fillHeight } from '@/apps/shared/functions/viewport';

export function useResize(event) {
  const scrollContainer = ref(null);

  const resize = () => {
    scrollContainer.value.style.maxHeight = `${fillHeight(scrollContainer, 26)}px`;
  }

  useEvent(window, event, resize, true);

  return { scrollContainer }
}
