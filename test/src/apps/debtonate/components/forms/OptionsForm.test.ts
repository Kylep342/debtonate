import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { setActivePinia } from 'pinia';

import OptionsForm from '@/apps/debtonate/components/forms/OptionsForm.vue';
import BaseModal from '@/apps/shared/components/ui/BaseModal.vue';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';
import BaseCard from '@/apps/shared/components/ui/BaseCard.vue';
import BaseMenu from '@/apps/shared/components/ui/BaseMenu.vue';

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
      BaseMenu,
    },
    stubs: {
      GlobalOptionsFormlet: true,
    },
  };

  it('renders all sections by default when on the All tab', () => {
    const wrapper = mount(OptionsForm, {
      global: globalConfig,
    });

    expect(wrapper.text()).toContain('Debtonate Options');
    const tabButtons = wrapper.findAll('.bg-base-300\\/40 button');
    expect(tabButtons.length).toBe(4);
    expect(tabButtons[0].text()).toBe('All');
    expect(tabButtons[0].classes()).toContain('btn-primary');

    // All sections are visible
    expect(wrapper.text()).toContain('Strategy & Priority');
    expect(wrapper.text()).toContain('Display & Regional');
    expect(wrapper.text()).toContain('Data & Storage');
    expect(wrapper.text()).toContain('Privacy & Data Ownership');
  });

  it('filters to the Data tab when tab button is clicked', async () => {
    const wrapper = mount(OptionsForm, {
      global: globalConfig,
    });

    // Click on 'Data' tab button
    const tabButtons = wrapper.findAll('.bg-base-300\\/40 button');
    const dataTab = tabButtons.find(b => b.text() === 'Data');
    expect(dataTab).toBeDefined();
    await dataTab!.trigger('click');

    expect(dataTab!.classes()).toContain('btn-primary');
    // Verify privacy disclaimer is rendered and strategy is hidden
    expect(wrapper.text()).toContain('Privacy & Data Ownership');
    expect(wrapper.text()).toContain('All data and calculation activity remain strictly within your browser');
    expect(wrapper.text()).toContain('Saving, exporting, sharing, or deleting your plan is completely at your discretion');
    expect(wrapper.text()).not.toContain('Repayment Priority Method');
  });
});
