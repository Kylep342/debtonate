import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setActivePinia } from 'pinia';
import DebtonateApplet from '@/apps/debtonate/debtonate/DebtonateApplet.vue';

describe('DebtonateApplet Component', () => {
  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn });
    setActivePinia(pinia);
  });

  it('renders Repayment Analysis header and GraphsPanel', () => {
    const wrapper = mount(DebtonateApplet, {
      global: {
        stubs: {
          GraphsPanel: true,
        },
      },
    });

    expect(wrapper.text()).toContain('Repayment Analysis');
    expect(wrapper.find('h2').text()).toBe('Repayment Analysis');
  });
});
