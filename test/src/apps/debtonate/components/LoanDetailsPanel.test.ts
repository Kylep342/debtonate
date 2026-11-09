import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { nextTick } from 'vue';
import { setActivePinia } from 'pinia';

import LoanDetailsPanel from '@/apps/debtonate/components/LoanDetailsPanel.vue';
import { useDebtonateCoreStore } from '@/apps/debtonate/stores/core';
import BaseModal from '@/apps/shared/components/ui/BaseModal.vue';
import BaseCard from '@/apps/shared/components/ui/BaseCard.vue';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';
import BaseMenu from '@/apps/shared/components/ui/BaseMenu.vue';
import BaseTabs from '@/apps/shared/components/ui/BaseTabs.vue';
import BaseTable from '@/apps/shared/components/ui/BaseTable.vue';
import DataTable from '@/apps/shared/components/DataTable.vue';
import TabularAnalysis from '@/apps/shared/components/TabularAnalysis.vue';

describe('LoanDetailsPanel Component', () => {
  const mockLoan = {
    id: 'loan-1',
    name: 'Auto Loan',
    principal: 20000,
    currentBalance: 20000,
    annualRate: 0.06,
    periodsPerYear: 12,
    termInYears: 5,
    minPayment: 386.66,
    fees: 0,
  };

  beforeEach(() => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
      initialState: {
        debtonateCore: {
          currentLoanId: 'loan-1',
          loanDetailsPanelActive: true,
          loans: [mockLoan],
          budgets: [
            { id: 'b1', relative: 50 },
            { id: 'b2', relative: 250 },
          ],
          refinancingScenarios: {},
          refinancingSchedules: {},
        },
      },
    });
    setActivePinia(pinia);
  });

  const globalConfig = {
    components: {
      BaseModal,
      BaseCard,
      BaseButton,
      BaseMenu,
      BaseTabs,
      BaseTable,
      DataTable,
      TabularAnalysis,
    },
  };

  it('renders correctly and switches between paired tabs (Amortization Schedule and Comparative Analysis)', async () => {
    const store = useDebtonateCoreStore();
    vi.mocked(store.getLoan).mockReturnValue(mockLoan as any);
    vi.mocked(store.getLoanName).mockReturnValue('Auto Loan');
    vi.mocked(store.buildLoanSubtitle).mockReturnValue('6.00% APR | $20,000 balance');
    vi.mocked(store.getBudgetName).mockImplementation((id: string) => {
      if (id === 'b1') return 'Budget A';
      if (id === 'b2') return 'Budget B';
      return 'Minimum';
    });
    vi.mocked(store.getPaymentSchedule).mockReturnValue({
      lifetimeInterest: 2000n,
      lifetimePrincipal: 20000n,
      amortizationSchedule: [],
    } as any);
    vi.mocked(store.getLoanComparativeAnalysis).mockReturnValue({
      'Total Interest': { default: '$4,000', b1: '$3,200', b2: '$1,900' },
      'Periods to Payoff': { default: '60', b1: '48', b2: '32' },
    });

    const wrapper = mount(LoanDetailsPanel, {
      props: { id: 'loanDetailsPanel' },
      global: globalConfig,
    });

    await nextTick();

    // Verify title and stats
    expect(wrapper.text()).toContain('Auto Loan');
    expect(wrapper.text()).toContain('6.00% APR');

    // Conditional refinance prompt bar is visible when no refinancing scenarios exist
    const promptBar = wrapper.find('#bar-refinance-prompt');
    expect(promptBar.exists()).toBe(true);
    expect(promptBar.text()).toContain('Refinance this loan to see a head-to-head scenario comparison.');
    const refiBtn = wrapper.find('#btn-details-refinance');
    expect(refiBtn.exists()).toBe(true);
    await refiBtn.trigger('click');
    expect(store.refinanceLoan).toHaveBeenCalledWith('loan-1');

    // Budget dropdown exists
    const menu = wrapper.findComponent(BaseMenu);
    expect(menu.exists()).toBe(true);
    expect(menu.props('text')).toBe('Minimum');

    // Paired tabs exist
    const tabs = wrapper.findAll('.tabs-boxed button');
    expect(tabs.length).toBe(2);
    expect(tabs[0].text()).toBe('Amortization Schedule');
    expect(tabs[1].text()).toBe('Comparative Analysis');

    // Default view is Amortization Schedule
    expect(tabs[0].classes()).toContain('tab-active');
    expect(wrapper.findComponent(DataTable).exists()).toBe(true);
    expect(wrapper.findComponent(TabularAnalysis).exists()).toBe(false);

    // Switch to Comparative Analysis
    await tabs[1].trigger('click');
    await nextTick();

    expect(tabs[1].classes()).toContain('tab-active');
    expect(wrapper.findComponent(TabularAnalysis).exists()).toBe(true);
    expect(wrapper.findComponent(DataTable).exists()).toBe(false);

    // Dynamic crosstab content rendered
    expect(wrapper.text()).toContain('Auto Loan - Budget Comparison');
    expect(wrapper.text()).toContain('Budget A');
    expect(wrapper.text()).toContain('Budget B');
    expect(wrapper.text()).toContain('$3,200');
    expect(wrapper.text()).toContain('$1,900');
  });

  it('renders Refinancing Comparison, scenario selector, and supports scenario deletion when refinancing scenarios exist', async () => {
    const mockScenario = {
      id: 'scen-1',
      name: 'Refi Offer 1',
      principal: 20000,
      currentBalance: 20000,
      annualRate: 0.045,
      periodsPerYear: 12,
      termInYears: 4,
      minPayment: 456.07,
      fees: 200,
    };

    const store = useDebtonateCoreStore();
    store.refinancingScenarios = {
      'loan-1': [mockScenario as any],
    };

    vi.mocked(store.getLoan).mockReturnValue(mockLoan as any);
    vi.mocked(store.getLoanName).mockImplementation((id: string) => {
      if (id === 'loan-1') return 'Auto Loan';
      if (id === 'scen-1') return 'Refi Offer 1';
      return id;
    });
    vi.mocked(store.buildLoanSubtitle).mockReturnValue('6.00% APR | $20,000 balance');
    vi.mocked(store.getBudgetName).mockReturnValue('Minimum');
    vi.mocked(store.getPaymentSchedule).mockReturnValue({
      lifetimeInterest: 2000n,
      lifetimePrincipal: 20000n,
      amortizationSchedule: [],
    } as any);
    vi.mocked(store.getRefinancingComparativeAnalysis).mockReturnValue({
      'Current Balance': { 'loan-1': '$20,000.00', 'scen-1': '$20,000.00' },
      'Interest Rate': { 'loan-1': '6.00%', 'scen-1': '4.50%' },
      'Monthly Payment': { 'loan-1': '$386.66', 'scen-1': '$456.07' },
      'Total Interest': { 'loan-1': '$3,199.36', 'scen-1': '$1,891.36' },
      'Total Cost': { 'loan-1': '$23,199.36', 'scen-1': '$22,091.36' },
      'Periods to Payoff': { 'loan-1': 60, 'scen-1': 48 },
    });

    const wrapper = mount(LoanDetailsPanel, {
      props: { id: 'loanDetailsPanel' },
      global: globalConfig,
    });

    await nextTick();

    // Conditional refinance prompt bar is hidden when refinancing scenarios exist
    expect(wrapper.find('#bar-refinance-prompt').exists()).toBe(false);

    // Both Scenario and Budget dropdown menus exist
    const menus = wrapper.findAllComponents(BaseMenu);
    expect(menus.length).toBe(2);
    expect(menus[0].props('text')).toBe('Auto Loan');
    expect(menus[1].props('text')).toBe('Minimum');

    // Switch to Scenario via dropdown button
    const scenarioButtons = menus[0].props('buttons');
    expect(scenarioButtons.length).toBe(2);
    scenarioButtons[1].onClick();
    await nextTick();
    expect(menus[0].props('text')).toBe('Refi Offer 1');
    expect(wrapper.text()).toContain('4.50% APR');

    // Switch to Comparative Analysis tab
    const tabs = wrapper.findAll('.tabs-boxed button');
    await tabs[1].trigger('click');
    await nextTick();

    expect(wrapper.text()).toContain('Auto Loan - Refinancing Comparison');
    expect(wrapper.text()).toContain('Refi Offer 1');
    expect(wrapper.text()).toContain('$1,891.36');

    // Delete scenario from TabularAnalysis
    const deleteBtn = wrapper.find('#btn-delete-scenario-scen-1');
    expect(deleteBtn.exists()).toBe(true);
    await deleteBtn.trigger('click');
    await nextTick();

    expect(store.deleteRefinancingScenario).toHaveBeenCalledWith('loan-1', 'scen-1');
  });
});
