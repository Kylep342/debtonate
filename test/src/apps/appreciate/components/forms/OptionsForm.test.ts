import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { setActivePinia } from 'pinia';

import OptionsForm from '@/apps/appreciate/components/forms/OptionsForm.vue';
import BaseModal from '@/apps/shared/components/ui/BaseModal.vue';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';
import BaseCard from '@/apps/shared/components/ui/BaseCard.vue';
import BaseMenu from '@/apps/shared/components/ui/BaseMenu.vue';
import { useGlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { getAppHistoryRef, resetAllStateHistory } from '@/apps/shared/composables/useStateHistory';

describe('Appreciate OptionsForm Component', () => {
  beforeEach(() => {
    resetAllStateHistory();
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

    expect(wrapper.text()).toContain('Appreciate Options');
    const tabButtons = wrapper.findAll('.bg-base-300\\/40 button');
    expect(tabButtons.length).toBe(5);
    expect(tabButtons[0].text()).toBe('All');
    expect(tabButtons[0].classes()).toContain('btn-primary');

    // All sections are visible
    expect(wrapper.text()).toContain('Growth & Inflation');
    expect(wrapper.text()).toContain('Retirement Horizon');
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
    // Verify privacy disclaimer is rendered and growth is hidden
    expect(wrapper.text()).toContain('Privacy & Data Ownership');
    expect(wrapper.text()).toContain('All data and calculation activity remain strictly within your browser');
    expect(wrapper.text()).toContain('Saving, exporting, sharing, or deleting your plan is completely at your discretion');
    expect(wrapper.text()).not.toContain('Accrue Before Contribution');
  });

  it('renders glossary section in Data tab and opens glossary on View click', async () => {
    const wrapper = mount(OptionsForm, {
      global: globalConfig,
    });

    const globalOptions = useGlobalOptionsStore();

    expect(wrapper.text()).toContain('Financial Glossary & Guide');
    expect(wrapper.text()).toContain('Browse definitions, calculation formulas, and strategies for all investment and retirement metrics.');

    const buttons = wrapper.findAllComponents(BaseButton);
    const viewButton = buttons.find((btn) => btn.text() === 'View');
    expect(viewButton).toBeDefined();

    await viewButton!.trigger('click');
    expect(globalOptions.openGlossary).toHaveBeenCalled();
  });

  it('renders auto-load toggle next to state controls and calls toggleAutoLoadState', async () => {
    const wrapper = mount(OptionsForm, {
      global: globalConfig,
    });

    const globalOptions = useGlobalOptionsStore();

    expect(wrapper.text()).toContain('Browser Local Storage & State');
    expect(wrapper.text()).toContain('Auto-load state');

    const toggle = wrapper.find('#optionsForm-auto-load');
    expect(toggle.exists()).toBe(true);

    await toggle.trigger('change');
    expect(globalOptions.toggleAutoLoadState).toHaveBeenCalled();
  });

  it('renders auto-save toggle next to state controls and calls toggleAutoSaveState', async () => {
    const wrapper = mount(OptionsForm, {
      global: globalConfig,
    });

    const globalOptions = useGlobalOptionsStore();

    expect(wrapper.text()).toContain('Auto-save state');

    const toggle = wrapper.find('#optionsForm-auto-save');
    expect(toggle.exists()).toBe(true);

    await toggle.trigger('change');
    expect(globalOptions.toggleAutoSaveState).toHaveBeenCalled();
  });

  it('renders disabled Undo button when history is empty, and enables it when multiple snapshots exist', async () => {
    const history = getAppHistoryRef('appreciate');
    history.value = [];

    const wrapper = mount(OptionsForm, {
      global: globalConfig,
    });

    const undoBtn = wrapper.find('#optionsForm-undo');
    expect(undoBtn.exists()).toBe(true);
    expect(undoBtn.attributes('disabled')).toBeDefined();

    history.value = [
      { id: '1', timestamp: Date.now(), hash: 'hash1', summary: '1 instrument ($10,000)', data: { 'appreciate.instruments': [] } },
      { id: '2', timestamp: Date.now() - 60000, hash: 'hash2', summary: '2 instruments ($20,000)', data: { 'appreciate.instruments': [] } },
    ];
    await wrapper.vm.$nextTick();

    expect(undoBtn.attributes('disabled')).toBeUndefined();

    // Trigger undo
    await undoBtn.trigger('click');
    expect(history.value[0].summary).toBe('2 instruments ($20,000)');
  });

  it('renders snapshot history list and allows restoring a previous snapshot', async () => {
    const history = getAppHistoryRef('appreciate');
    const validInstrument = {
      id: 'i1',
      currentBalance: 1000,
      annualRate: 7,
      name: 'Test Equity',
      annualLimit: 0,
    };

    history.value = [
      { id: '1', timestamp: Date.now(), hash: 'hash1', summary: 'Current: 0 instruments', data: { 'appreciate.instruments': [] } },
      { id: '2', timestamp: Date.now() - 30000, hash: 'hash2', summary: 'Previous: 1 instrument', data: { 'appreciate.instruments': [validInstrument] } },
    ];

    const wrapper = mount(OptionsForm, {
      global: globalConfig,
    });

    expect(wrapper.text()).toContain('State Memory (Last 2 of 10)');
    expect(wrapper.text()).toContain('Current: 0 instruments');
    expect(wrapper.text()).toContain('Previous: 1 instrument');

    const restore0 = wrapper.find('#optionsForm-restore-0');
    expect(restore0.attributes('disabled')).toBeDefined();

    const restore1 = wrapper.find('#optionsForm-restore-1');
    expect(restore1.attributes('disabled')).toBeUndefined();

    await restore1.trigger('click');
    expect(history.value[0].summary).toBe('Previous: 1 instrument');
  });

  it('clears state history when Clear history is clicked', async () => {
    const history = getAppHistoryRef('appreciate');
    history.value = [
      { id: '1', timestamp: Date.now(), hash: 'hash1', summary: 'Snapshot', data: {} },
    ];

    const wrapper = mount(OptionsForm, {
      global: globalConfig,
    });

    const clearHistoryBtn = wrapper.find('#optionsForm-clear-history');
    expect(clearHistoryBtn.exists()).toBe(true);

    await clearHistoryBtn.trigger('click');
    expect(history.value).toEqual([]);
    expect(wrapper.find('#optionsForm-history').exists()).toBe(false);
  });
});
