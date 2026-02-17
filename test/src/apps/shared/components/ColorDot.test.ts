import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import ColorDot from '@/apps/shared/components/ColorDot.vue';

describe('ColorDot Component', () => {
  it('renders correctly with color prop', () => {
    const color = 'rgb(255, 0, 0)';
    const wrapper = mount(ColorDot, {
      props: {
        color
      }
    });

    const dot = wrapper.find('.color-dot');
    expect(dot.exists()).toBe(true);
    // Vue applies style bindings to the element's style attribute
    expect(dot.attributes('style')).toContain(`background-color: ${color}`);
  });
});
