import { ref, onMounted, onUnmounted, computed } from 'vue';

import { TooltipSize } from '@/apps/shared/types/graph';

export const fillHeight = (componentRef: any, bottomDelta: number=0) => {
  if (!componentRef.value) return 0;
  const containerTop = componentRef.value.getBoundingClientRect().top;
  const availableHeight = window.innerHeight - (containerTop + bottomDelta);
  return availableHeight;
};

export const fillWidth = (componentRef: any, rightDelta: number=0) => {
  if (!componentRef.value) return 0;
  const containerLeft = componentRef.value.getBoundingClientRect().left;
  const availableWidth = window.innerWidth - (containerLeft + rightDelta);
  return availableWidth;
};

/**
 * Calculates the optimal CSS transform to keep a tooltip within the viewport.
 */
export function smartTransform(
  tooltipSize: TooltipSize,
  cursorX: number,
  cursorY: number,
  offset: number = 15
) {
  let translateX = '0%';
  let translateY = '0%';

  if (cursorX + tooltipSize.width + offset > window.innerWidth) {
    translateX = '-100%';
  }

  if (cursorY + tooltipSize.height + offset > window.innerHeight) {
    translateY = '-100%';
  }

  return `translateX(${translateX}) translateY(${translateY})`;
}

/**
 * Reactive breakpoint utility
 */
export function useBreakpoint() {
  const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1024);

  const updateWidth = () => {
    width.value = window.innerWidth;
  };

  onMounted(() => {
    window.addEventListener('resize', updateWidth);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateWidth);
  });

  const isMobile = computed(() => width.value < 768);
  const isTablet = computed(() => width.value >= 768 && width.value < 1024);
  const isDesktop = computed(() => width.value >= 1024);

  return {
    width,
    isMobile,
    isTablet,
    isDesktop
  };
}
