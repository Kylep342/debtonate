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
    const callback = vi.fn();

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
    const callbackSpy = vi.fn();

    mountComposable(() => {
      useEvent(window, 'resize', callbackSpy, true); // callOnMount is true
    });

    expect(callbackSpy).toHaveBeenCalledTimes(1);
  });

  it('should NOT call the callback on mount when callOnMount is false or omitted', () => {
    const callbackSpy = vi.fn();

    mountComposable(() => {
      useEvent(window, 'resize', callbackSpy); // callOnMount is omitted (defaults to false)
    });

    expect(callbackSpy).not.toHaveBeenCalled();
  });
});
