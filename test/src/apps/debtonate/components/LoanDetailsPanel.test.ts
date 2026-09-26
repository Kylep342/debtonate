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
});
