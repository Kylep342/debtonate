import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';
import { mount } from '@vue/test-utils';

import { useEvent } from '@/apps/shared/composables/useEvent';

const mountComposable = (callback: () => void) => {
  const TestComponent = defineComponent({
    setup() {
      callback();
      return () => {}; // Render function
    },
  });
  return mount(TestComponent);
};


describe('useEvent composable', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should add an event listener on mount and remove it on unmount', () => {
    const addListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeListenerSpy = vi.spyOn(window, 'removeEventListener');
    const matchMediaSpy = vi.spyOn(window, 'matchMedia');
    const callback = vi.fn(() => true);

    const wrapper = mountComposable(() => {
      useEvent(window, 'resize', callback);
    });

    expect(addListenerSpy).toHaveBeenCalledTimes(1);
    expect(addListenerSpy).toHaveBeenCalledWith('resize', callback);

    wrapper.unmount();

    expect(removeListenerSpy).toHaveBeenCalledTimes(1);
    expect(removeListenerSpy).toHaveBeenCalledWith('resize', callback);
  });

  it('should call the callback on mount when callOnMount is true', () => {
    // locally scoped to isolate call counts
    const callback= vi.fn(() => true);

    mountComposable(() => {
      useEvent(window, 'resize', callback, true); // callOnMount is true
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should NOT call the callback on mount when callOnMount is false or omitted', () => {
    // locally scoped to isolate call counts
    const callback = vi.fn(() => true);

    mountComposable(() => {
      useEvent(window, 'resize', callback); // callOnMount is omitted (defaults to false)
    });

    expect(callback).not.toHaveBeenCalled();
  });
});
