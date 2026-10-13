import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import App from '@/App.vue';

describe('App Component', () => {
  it('renders router-view container', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          RouterView: { template: '<div data-testid="router-view-content" />' },
        },
      },
    });

    expect(wrapper.find('#debtonate').exists()).toBe(true);
    expect(wrapper.find('[data-testid="router-view-content"]').exists()).toBe(true);
  });
});
