import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import BaseAlert from '@/apps/shared/components/ui/BaseAlert.vue';

describe('BaseAlert Component', () => {
  it('renders the message correctly', () => {
    const wrapper = mount(BaseAlert, {
      props: {
        id: 'test-alert',
        message: 'This is a test alert'
      }
    });

    expect(wrapper.text()).toContain('This is a test alert');
    expect(wrapper.find('div').classes()).toContain('alert');
    expect(wrapper.find('div').classes()).toContain('alert-info');
  });
});
