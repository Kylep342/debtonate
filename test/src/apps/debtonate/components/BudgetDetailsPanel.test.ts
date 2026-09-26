import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { nextTick } from 'vue';
import { setActivePinia } from 'pinia';

import BudgetDetailsPanel from '@/apps/debtonate/components/BudgetDetailsPanel.vue';
import { useDebtonateCoreStore } from '@/apps/debtonate/stores/core';
import BaseModal from '@/apps/shared/components/ui/BaseModal.vue';
import BaseCard from '@/apps/shared/components/ui/BaseCard.vue';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';
import BaseMenu from '@/apps/shared/components/ui/BaseMenu.vue';
import BaseTabs from '@/apps/shared/components/ui/BaseTabs.vue';
import BaseTable from '@/apps/shared/components/ui/BaseTable.vue';
import DataTable from '@/apps/shared/components/DataTable.vue';
import TabularAnalysis from '@/apps/shared/components/TabularAnalysis.vue';

describe('BudgetDetailsPanel Component (Debtonate)', () => {
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

  const mockBudget = {
    id: 'b1',
    relative: 100,
    absolute: 500,
  };

  beforeEach(() => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
      initialState: {
        debtonateCore: {
          currentBudgetId: 'b1',
          budgetDetailsPanelActive: true,
          loans: [mockLoan],
          budgets: [mockBudget],
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

  it('renders correctly and switches between Amortization Schedule and Comparative Analysis tabs', async () => {
    const store = useDebtonateCoreStore();
    vi.mocked(store.getBudget).mockReturnValue(mockBudget as any);
    vi.mocked(store.getBudgetName).mockReturnValue('Budget 1');
    vi.mocked(store.getLoan).mockReturnValue(mockLoan as any);
    vi.mocked(store.getLoanName).mockImplementation((id: string) => {
      if (id === 'loan-1') return 'Auto Loan';
      if (id === 'totals') return 'All Loans';
      return id;
    });
    vi.mocked(store.getPaymentSchedule).mockReturnValue({
      lifetimeInterest: 2000n,
      lifetimePrincipal: 20000n,
      amortizationSchedule: [],
    } as any);
    vi.mocked(store.getLoanComparativeAnalysis).mockReturnValue({
      'Total Interest': { b1: '$2,000' },
      'Periods to Payoff': { b1: '48' },
    });

    const wrapper = mount(BudgetDetailsPanel, {
      props: { id: 'budgetDetailsPanel' },
      global: globalConfig,
    });

    await nextTick();

    // Verify title and stats
    expect(wrapper.text()).toContain('Budget Details - Budget 1');
    expect(wrapper.text()).toContain('$500.00/mo');

    // Vehicle dropdown exists
    const menu = wrapper.findComponent(BaseMenu);
    expect(menu.exists()).toBe(true);
    expect(menu.props('text')).toBe('All Loans');

    // Paired navigation tabs
    const tabs = wrapper.findAll('.tabs-boxed button');
    expect(tabs.length).toBe(2);
    expect(tabs[0].text()).toBe('Amortization Schedule');
    expect(tabs[1].text()).toBe('Comparative Analysis');

    // Default tab is Amortization Schedule
    expect(tabs[0].classes()).toContain('tab-active');
    expect(wrapper.findComponent(DataTable).exists()).toBe(true);
    expect(wrapper.findComponent(TabularAnalysis).exists()).toBe(false);

    // Switch to Comparative Analysis
    await tabs[1].trigger('click');
    await nextTick();

    expect(tabs[1].classes()).toContain('tab-active');
    expect(wrapper.findComponent(TabularAnalysis).exists()).toBe(true);
    expect(wrapper.findComponent(DataTable).exists()).toBe(false);

    // Crosstab content compares budgets for the selected vehicle
    expect(wrapper.text()).toContain('All Loans - Budget Comparison');
    expect(wrapper.text()).toContain('Budget 1');
    expect(wrapper.text()).toContain('$2,000');
  });
});
