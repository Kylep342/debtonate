import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { ref } from 'vue';

import { fillHeight, fillWidth, smartTransform } from '@/apps/shared/functions/viewport';

describe('viewport module', () => {
  beforeEach(() => {
    vi.stubGlobal('innerWidth', 1024);
    vi.stubGlobal('innerHeight', 768);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('fillHeight', () => {
    it('returns 0 when ref is null or empty', () => {
      const componentRef = ref(null);
      expect(fillHeight(componentRef)).toBe(0);
    });

    it('calculates available height based on getBoundingClientRect and delta', () => {
      const mockElement = {
        getBoundingClientRect: () => ({ top: 100 }),
      };
      const componentRef = ref(mockElement);

      expect(fillHeight(componentRef)).toBe(668); // 768 - 100
      expect(fillHeight(componentRef, 50)).toBe(618); // 768 - 150
    });
  });

  describe('fillWidth', () => {
    it('returns 0 when ref is null or empty', () => {
      const componentRef = ref(null);
      expect(fillWidth(componentRef)).toBe(0);
    });

    it('calculates available width based on getBoundingClientRect and delta', () => {
      const mockElement = {
        getBoundingClientRect: () => ({ left: 200 }),
      };
      const componentRef = ref(mockElement);

      expect(fillWidth(componentRef)).toBe(824); // 1024 - 200
      expect(fillWidth(componentRef, 24)).toBe(800); // 1024 - 224
    });
  });

  describe('smartTransform', () => {
    it('returns 0% translation when tooltip fits inside viewport', () => {
      const transform = smartTransform({ width: 100, height: 50 }, 100, 100);
      expect(transform).toBe('translateX(0%) translateY(0%)');
    });

    it('shifts tooltip left when near right edge', () => {
      const transform = smartTransform({ width: 100, height: 50 }, 950, 100);
      expect(transform).toBe('translateX(-100%) translateY(0%)');
    });

    it('shifts tooltip up when near bottom edge', () => {
      const transform = smartTransform({ width: 100, height: 50 }, 100, 750);
      expect(transform).toBe('translateX(0%) translateY(-100%)');
    });

    it('shifts tooltip both up and left when near bottom-right corner', () => {
      const transform = smartTransform({ width: 100, height: 50 }, 950, 750);
      expect(transform).toBe('translateX(-100%) translateY(-100%)');
    });
  });
});
