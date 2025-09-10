import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';

// mock fillHeight w/out real browser
vi.mock('@/apps/shared/functions/viewport', () => ({
  fillHeight: vi.fn(),
}));

import { useResize } from '@/apps/shared/composables/useResize';
import { fillHeight } from '@/apps/shared/functions/viewport';

const mountComposable = (callback: () => any) => {
  const TestComponent = defineComponent({
    setup() {
      const result = callback();
      return { ...result };
    },
    template: '<div ref="scrollContainer"></div>',
  });
  return mount(TestComponent);
};

describe('useResize composable (with real useEvent)', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should set the initial height on mount', () => {
    const MOCK_HEIGHT = 500;
    fillHeight.mockReturnValue(MOCK_HEIGHT);

    const wrapper = mountComposable(() => useResize('resize'));

    expect(fillHeight).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.scrollContainer.style.maxHeight).toBe(`${MOCK_HEIGHT}px`);

    wrapper.unmount();
  });

  it('should update the height when the window resize event is dispatched', async () => {
    const INITIAL_HEIGHT = 500;
    const RESIZE_HEIGHT = 300;

    fillHeight.mockReturnValue(INITIAL_HEIGHT);

    const wrapper = mountComposable(() => useResize('resize'));

    expect(wrapper.vm.scrollContainer.style.maxHeight).toBe(`${INITIAL_HEIGHT}px`);

    fillHeight.mockReturnValue(RESIZE_HEIGHT);
    window.dispatchEvent(new Event('resize'));
    await wrapper.vm.$nextTick();

    expect(fillHeight).toHaveBeenCalledTimes(2);
    expect(wrapper.vm.scrollContainer.style.maxHeight).toBe(`${RESIZE_HEIGHT}px`);

    wrapper.unmount();
  });
});
