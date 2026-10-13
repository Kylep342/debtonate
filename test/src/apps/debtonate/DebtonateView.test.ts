import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DebtonateView from '@/apps/debtonate/DebtonateView.vue';
import { useDebtonateCoreStore } from '@/apps/debtonate/stores/core';
import { useGlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import constants from '@/apps/debtonate/constants/constants';

describe('DebtonateView Component', () => {
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
      LoanForm: { template: '<div data-testid="loan-form" />' },
      OptionsForm: { template: '<div data-testid="options-form" />' },
      RefinancingForm: { template: '<div data-testid="refinancing-form" />' },
      GlossaryModal: { template: '<div data-testid="glossary-modal" />' },
      ShareExportModal: { template: '<div data-testid="share-export-modal" />' },
      BudgetDetailsPanel: { template: '<div data-testid="budget-details" />' },
      LoanDetailsPanel: { template: '<div data-testid="loan-details" />' },
      LoansPanel: { template: '<div data-testid="loans-panel" />' },
      BudgetsPanel: { template: '<div data-testid="budgets-panel" />' },
      SiteIntro: { template: '<div data-testid="site-intro" />' },
      DebtonateApplet: { template: '<div data-testid="debtonate-applet" />' },
      RepatriateApplet: { template: '<div data-testid="repatriate-applet" />' },
      BaseAlert: { template: '<div data-testid="base-alert">{{ message }}</div>', props: ['message'] },
    },
  };

  it('renders desktop layout with SiteIntro when loans array is empty', () => {
    const store = useDebtonateCoreStore();
    store.loans = [];

    const wrapper = mount(DebtonateView, { global: globalConfig });

    expect(wrapper.find('[data-testid="site-intro"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="debtonate-applet"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="loans-panel"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="budgets-panel"]').exists()).toBe(true);
  });

  it('renders DebtonateApplet when loans exist and phase is DEBTONATE', () => {
    const store = useDebtonateCoreStore();
    store.createLoan(10000, 5, 3, 'Auto Loan', 10000, 0);
    store.viewPhase = constants.PHASE_DEBTONATE;

    const wrapper = mount(DebtonateView, { global: globalConfig });

    expect(wrapper.find('[data-testid="site-intro"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="debtonate-applet"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="repatriate-applet"]').exists()).toBe(false);
  });

  it('renders RepatriateApplet when loans exist and phase is REPATRIATE', () => {
    const store = useDebtonateCoreStore();
    store.createLoan(10000, 5, 3, 'Auto Loan', 10000, 0);
    store.viewPhase = constants.PHASE_REPATRIATE;

    const wrapper = mount(DebtonateView, { global: globalConfig });

    expect(wrapper.find('[data-testid="repatriate-applet"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="debtonate-applet"]').exists()).toBe(false);
  });

  it('switches tabs in mobile view and shows summary pill when tab is not analysis', async () => {
    window.innerWidth = 500;
    const store = useDebtonateCoreStore();
    store.createLoan(5000, 15, 2, 'Credit Card', 5000, 0);
    store.viewPhase = constants.PHASE_DEBTONATE;

    const wrapper = mount(DebtonateView, { global: globalConfig });

    const tabs = wrapper.findAll('.tabs a');
    expect(tabs.length).toBe(3);

    // Switch to loans tab
    await tabs[0].trigger('click');
    expect(wrapper.find('[data-testid="loans-panel"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="budgets-panel"]').exists()).toBe(false);

    // Summary pill should be visible in loans tab
    const summaryBtn = wrapper.find('button.pointer-events-auto');
    expect(summaryBtn.exists()).toBe(true);

    // Clicking summary pill returns to analysis tab
    await summaryBtn.trigger('click');
    expect(wrapper.find('[data-testid="debtonate-applet"]').exists()).toBe(true);

    // Switch to budgets tab
    await tabs[1].trigger('click');
    expect(wrapper.find('[data-testid="budgets-panel"]').exists()).toBe(true);
  });

  it('calls autoLoadIfEnabled on mounted', () => {
    const globalOptions = useGlobalOptionsStore();
    const spy = vi.spyOn(globalOptions, 'autoLoadIfEnabled');

    mount(DebtonateView, { global: globalConfig });

    expect(spy).toHaveBeenCalledWith('debtonate', expect.any(Function));
  });

  it('triggers debounced state.saveState when autoSaveState is enabled and loans change', async () => {
    vi.useFakeTimers();
    const store = useDebtonateCoreStore();
    const globalOptions = useGlobalOptionsStore();
    globalOptions.setAutoSaveState(true);
    const saveSpy = vi.spyOn(store, 'saveState');

    mount(DebtonateView, { global: globalConfig });

    store.createLoan(5000, 4, 2, 'Auto Loan', 5000, 0);
    await vi.advanceTimersByTimeAsync(500);

    expect(saveSpy).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
