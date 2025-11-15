import { Ref } from 'vue';

import { TooltipSize } from '@/apps/shared/types/graph';

export const fillHeight = (componentRef: Ref, bottomDelta: number=0) => {
  const containerTop = componentRef.value.getBoundingClientRect().top;
  const availableHeight = window.innerHeight - (containerTop + bottomDelta);
  return availableHeight;
};

//
export const fillWidth = (componentRef: Ref, rightDelta: number=0) => {
  const containerLeft = componentRef.value.getBoundingClientRect().left;
  const availableWidth = window.innerWidth - (containerLeft + rightDelta);
  return availableWidth;
};

/**
 * Calculates the optimal CSS transform to keep a tooltip within the viewport.
 *
 * @param {object} tooltipSize - The reactive size of the tooltip ({ width: number, height: number }).
 * @param {number} cursorX - The horizontal position of the mouse cursor.
 * @param {number} cursorY - The vertical position of the mouse cursor.
 * @param {number} offset - A small buffer to add between the cursor and the tooltip.
 * @returns {string} A CSS transform string (e.g., 'translateX(-100%) translateY(-100%)').
 */
export function smartTransform(
  tooltipSize: TooltipSize,
  cursorX: number,
  cursorY: number,
  offset: number = 15
) {
  let translateX = '0%';
  let translateY = '0%';

  // If the tooltip would overflow the right edge of the screen,
  // flip it to the left side of the cursor.
  if (cursorX + tooltipSize.width + offset > window.innerWidth) {
    translateX = '-100%';
  }

  // If the tooltip would overflow the bottom edge of the screen,
  // flip it above the cursor.
  if (cursorY + tooltipSize.height + offset > window.innerHeight) {
    translateY = '-100%';
  }

  return `translateX(${translateX}) translateY(${translateY})`;
}
