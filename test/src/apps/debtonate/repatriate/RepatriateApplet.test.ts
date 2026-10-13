import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setActivePinia } from 'pinia';
import RepatriateApplet from '@/apps/debtonate/repatriate/RepatriateApplet.vue';

describe('RepatriateApplet Component', () => {
  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn });
    setActivePinia(pinia);
  });

  it('renders Refinancing Analysis header and GraphsPanel', () => {
    const wrapper = mount(RepatriateApplet, {
      global: {
        stubs: {
          GraphsPanel: true,
        },
      },
    });

    expect(wrapper.text()).toContain('Refinancing Analysis');
    expect(wrapper.find('h2').text()).toBe('Refinancing Analysis');
  });
});
