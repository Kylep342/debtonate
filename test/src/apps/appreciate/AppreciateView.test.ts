import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AppreciateView from '@/apps/appreciate/AppreciateView.vue';
import { useAppreciateCoreStore } from '@/apps/appreciate/stores/core';
import { useGlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import constants from '@/apps/appreciate/constants/constants';

describe('AppreciateView Component', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
    window.innerWidth = 1200;
  });

  const globalConfig = {
    stubs: {
      HeaderBar: { template: '<header data-testid="header-bar" />' },
      FooterBar: { template: '<footer data-testid="footer-bar" />' },
      BudgetForm: { template: '<div data-testid="budget-form" />' },
      InstrumentForm: { template: '<div data-testid="instrument-form" />' },
      OptionsForm: { template: '<div data-testid="options-form" />' },
      GlossaryModal: { template: '<div data-testid="glossary-modal" />' },
      ShareExportModal: { template: '<div data-testid="share-export-modal" />' },
      BudgetDetailsPanel: { template: '<div data-testid="budget-details" />' },
      InstrumentDetailsPanel: { template: '<div data-testid="instrument-details" />' },
      InstrumentsPanel: { template: '<div data-testid="instruments-panel" />' },
      BudgetsPanel: { template: '<div data-testid="budgets-panel" />' },
      SiteIntro: { template: '<div data-testid="site-intro" />' },
      AppreciateApplet: { template: '<div data-testid="appreciate-applet" />' },
      InvestigateApplet: { template: '<div data-testid="investigate-applet" />' },
      BaseAlert: { template: '<div data-testid="base-alert">{{ message }}</div>', props: ['message'] },
    },
  };

  it('renders desktop layout with SiteIntro when instruments array is empty', () => {
    const store = useAppreciateCoreStore();
    store.instruments = [];

    const wrapper = mount(AppreciateView, { global: globalConfig });

    expect(wrapper.find('[data-testid="site-intro"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="appreciate-applet"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="instruments-panel"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="budgets-panel"]').exists()).toBe(true);
  });

  it('renders AppreciateApplet when instruments exist and phase is CAREER', () => {
    const store = useAppreciateCoreStore();
    store.createInstrument(50000, 7, 'S&P 500 ETF', 6500);
    store.viewPhase = constants.PHASE_CAREER;

    const wrapper = mount(AppreciateView, { global: globalConfig });

    expect(wrapper.find('[data-testid="site-intro"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="appreciate-applet"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="investigate-applet"]').exists()).toBe(false);
  });

  it('renders InvestigateApplet when instruments exist and phase is RETIREMENT', () => {
    const store = useAppreciateCoreStore();
    store.createInstrument(50000, 7, 'S&P 500 ETF', 6500);
    store.viewPhase = constants.PHASE_RETIREMENT;

    const wrapper = mount(AppreciateView, { global: globalConfig });

    expect(wrapper.find('[data-testid="investigate-applet"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="appreciate-applet"]').exists()).toBe(false);
  });

  it('switches tabs in mobile view and shows summary pill when tab is not analysis', async () => {
    window.innerWidth = 500;
    const store = useAppreciateCoreStore();
    store.createInstrument(25000, 6, 'Total Stock Market', 7000);
    store.viewPhase = constants.PHASE_CAREER;

    const wrapper = mount(AppreciateView, { global: globalConfig });

    const tabs = wrapper.findAll('.tabs a');
    expect(tabs.length).toBe(3);
    expect(tabs[1].text()).toBe('Budgets');

    // Switch to instruments tab
    await tabs[0].trigger('click');
    expect(wrapper.find('[data-testid="instruments-panel"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="budgets-panel"]').exists()).toBe(false);

    // Summary pill should be visible in instruments tab
    const summaryBtn = wrapper.find('button.pointer-events-auto');
    expect(summaryBtn.exists()).toBe(true);
    expect(summaryBtn.text()).toContain('Nest Egg');

    // Clicking summary pill returns to analysis tab
    await summaryBtn.trigger('click');
    expect(wrapper.find('[data-testid="appreciate-applet"]').exists()).toBe(true);

    // Switch to budgets tab
    await tabs[1].trigger('click');
    expect(wrapper.find('[data-testid="budgets-panel"]').exists()).toBe(true);
  });

  it('shows Withdrawals tab label and Horizon summary pill in retirement phase', async () => {
    window.innerWidth = 500;
    const store = useAppreciateCoreStore();
    store.createInstrument(300000, 5, 'Retirement Nest Egg', 0);
    store.viewPhase = constants.PHASE_RETIREMENT;

    const wrapper = mount(AppreciateView, { global: globalConfig });

    const tabs = wrapper.findAll('.tabs a');
    expect(tabs[1].text()).toBe('Withdrawals');

    await tabs[0].trigger('click');
    const summaryBtn = wrapper.find('button.pointer-events-auto');
    expect(summaryBtn.exists()).toBe(true);
    expect(summaryBtn.text()).toContain('Horizon');
  });

  it('calls autoLoadIfEnabled on mounted', () => {
    const globalOptions = useGlobalOptionsStore();
    const spy = vi.spyOn(globalOptions, 'autoLoadIfEnabled');

    mount(AppreciateView, { global: globalConfig });

    expect(spy).toHaveBeenCalledWith('appreciate', expect.any(Function));
  });

  it('triggers debounced state.saveState when autoSaveState is enabled and instruments change', async () => {
    vi.useFakeTimers();
    const store = useAppreciateCoreStore();
    const globalOptions = useGlobalOptionsStore();
    globalOptions.setAutoSaveState(true);
    const saveSpy = vi.spyOn(store, 'saveState');

    mount(AppreciateView, { global: globalConfig });

    store.createInstrument(10000, 7, 'Test Equity', 0);
    await vi.advanceTimersByTimeAsync(500);

    expect(saveSpy).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
