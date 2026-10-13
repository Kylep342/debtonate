import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import OptionsGear from '@/apps/shared/components/OptionsGear.vue';

describe('OptionsGear Component', () => {
  it('renders SVG icon correctly', () => {
    const wrapper = mount(OptionsGear);
    expect(wrapper.find('svg').exists()).toBe(true);
    expect(wrapper.find('path').exists()).toBe(true);
  });
});
