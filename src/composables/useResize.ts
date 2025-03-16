import { ref, onMounted, onUnmounted } from 'vue';

import { fillHeight } from '@/functions/viewport';

export function useResize(listenerName) {
  const scrollContainer = ref(null);

  const resize = () => {
    scrollContainer.value.style.maxHeight = `${fillHeight(scrollContainer, 26)}px`;
  }

  onMounted(() => {
    resize()
    window.addEventListener(listenerName, resize);
  });
  
  onUnmounted(() => {
    window.removeEventListener(listenerName, resize);
  });

  return { scrollContainer }
}
