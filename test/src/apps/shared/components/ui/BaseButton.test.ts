import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';

describe('BaseButton Component', () => {
  it('renders slot content correctly', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Click Me'
      }
    });

    expect(wrapper.text()).toBe('Click Me');
    expect(wrapper.find('button').exists()).toBe(true);
  });

  it('has the base button class', () => {
    const wrapper = mount(BaseButton);
    expect(wrapper.classes()).toContain('btn');
  });

  it('applies additional classes passed via class prop', () => {
    const wrapper = mount(BaseButton, {
      attrs: {
        class: 'btn-primary custom-class'
      }
    });

    expect(wrapper.classes()).toContain('btn');
    expect(wrapper.classes()).toContain('btn-primary');
    expect(wrapper.classes()).toContain('custom-class');
  });
});
