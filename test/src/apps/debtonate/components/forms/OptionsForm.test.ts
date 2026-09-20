import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { setActivePinia } from 'pinia';

import OptionsForm from '@/apps/debtonate/components/forms/OptionsForm.vue';
import BaseModal from '@/apps/shared/components/ui/BaseModal.vue';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';
import BaseCard from '@/apps/shared/components/ui/BaseCard.vue';

describe('Debtonate OptionsForm Component', () => {
  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn, stubActions: false });
    setActivePinia(pinia);
  });

  const globalConfig = {
    components: {
      BaseModal,
      BaseButton,
      BaseCard,
    },
    stubs: {
      GlobalOptionsFormlet: true,
    },
  };

  it('renders privacy disclaimer when navigating to the Data tab', async () => {
    const wrapper = mount(OptionsForm, {
      global: globalConfig,
    });

    expect(wrapper.text()).toContain('Debtonate Options');

    // Click on the 'Data' tab button
    const dataTabButton = wrapper.findAll('button').find(btn => btn.text() === 'Data');
    expect(dataTabButton).toBeDefined();
    await dataTabButton!.trigger('click');

    // Verify privacy disclaimer is rendered
    expect(wrapper.text()).toContain('Privacy & Data Ownership');
    expect(wrapper.text()).toContain('All data and calculation activity remain strictly within your browser');
    expect(wrapper.text()).toContain('Saving, exporting, sharing, or deleting your plan is completely at your discretion');
  });
});
