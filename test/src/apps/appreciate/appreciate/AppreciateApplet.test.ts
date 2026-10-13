import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setActivePinia } from 'pinia';
import AppreciateApplet from '@/apps/appreciate/appreciate/AppreciateApplet.vue';

describe('AppreciateApplet Component', () => {
  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn });
    setActivePinia(pinia);
  });

  it('renders Investment Analysis header and GraphsPanel', () => {
    const wrapper = mount(AppreciateApplet, {
      global: {
        stubs: {
          GraphsPanel: true,
        },
      },
    });

    expect(wrapper.text()).toContain('Investment Analysis');
    expect(wrapper.find('h2').text()).toBe('Investment Analysis');
  });
});
