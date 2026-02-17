import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { setActivePinia } from 'pinia';
import SiteIntro from '@/apps/shared/components/SiteIntro.vue';
import { useGlobalOptionsStore } from '@/apps/shared/stores/globalOptions';

describe('SiteIntro Component', () => {
  it('renders correctly with props', () => {
    const pinia = createTestingPinia({ createSpy: vi.fn });
    setActivePinia(pinia);
    const globalOptions = useGlobalOptionsStore();

    // Mock the Money helper
    vi.mocked(globalOptions.Money).mockImplementation((amount) => `$${amount}`);

    const wrapper = mount(SiteIntro, {
      props: {
        appName: 'TestApp',
        appDescription: 'doing cool stuff',
        itemType: 'widgets',
        budgetAction: 'payments'
      },
      global: {
        plugins: [pinia]
      }
    });

    expect(wrapper.text()).toContain('Welcome to TestApp!');
    expect(wrapper.text()).toContain('financial calculator for doing cool stuff');
    expect(wrapper.text()).toContain('towards my debt'); // budgetAction='payments' -> 'debt'
    expect(wrapper.text()).toContain('add some widgets');
    expect(wrapper.text()).toContain('additional payments');
  });

  it('renders correct text for contributions action', () => {
    const pinia = createTestingPinia({ createSpy: vi.fn });
    setActivePinia(pinia);
    const globalOptions = useGlobalOptionsStore();
    vi.mocked(globalOptions.Money).mockImplementation((amount) => `$${amount}`);

    const wrapper = mount(SiteIntro, {
      props: {
        appName: 'TestApp',
        appDescription: 'stuff',
        itemType: 'stuff',
        budgetAction: 'contributions'
      },
      global: {
        plugins: [pinia]
      }
    });

    expect(wrapper.text()).toContain('towards my retirement'); // budgetAction='contributions' -> 'retirement'
    expect(wrapper.text()).toContain('additional contributions');
  });
});
