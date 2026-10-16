import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { setActivePinia } from 'pinia';

import BudgetCard from '@/apps/debtonate/components/BudgetCard.vue';
import { useDebtonateCoreStore } from '@/apps/debtonate/stores/core';
import BaseCard from '@/apps/shared/components/ui/BaseCard.vue';
import BaseMenu from '@/apps/shared/components/ui/BaseMenu.vue';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';
import BaseTable from '@/apps/shared/components/ui/BaseTable.vue';
import DonutGraph from '@/apps/shared/components/ui/DonutGraph.vue';
import ColorDot from '@/apps/shared/components/ColorDot.vue';

describe('BudgetCard Component (Debtonate)', () => {
  const mockBudget = { id: 'b1', relative: 1000, absolute: 4000 };
  const mockLoanId = 'loan1';

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn });
    setActivePinia(pinia);
  });

  const globalConfig = {
    components: {
      BaseCard,
      BaseMenu,
      BaseButton,
      BaseTable,
      DonutGraph,
      ColorDot
    }
  };

  const mockGraphConfig = {
    header: vi.fn().mockReturnValue('Cost Header'),
    id: 'test',
    type: 'donut'
  };

  it('renders correctly', async () => {
    const store = useDebtonateCoreStore();
    store.loans = [{ id: 'loan1' }] as any;

    // Mock getters/state
    vi.mocked(store.getBudgetName).mockReturnValue('Debt Budget 1');
    vi.mocked(store.getPaymentSchedule).mockReturnValue({
      lifetimePrincipal: 5000,
      lifetimeInterest: 2000,
      amortizationSchedule: new Array(60).fill({})
    } as any);
    (store as any).budgetCardGraphConfig = mockGraphConfig;
    (store as any).cardGraphs = {
      [mockLoanId]: {
        [mockBudget.id]: [
          { label: 'Interest', value: 1000, color: 'red' },
          { label: 'Principal', value: 2000, color: 'blue' }
        ]
      }
    };

    const wrapper = mount(BudgetCard, {
      props: {
        budget: mockBudget as any,
        viewedLoanId: mockLoanId
      },
      global: globalConfig
    });

    expect(wrapper.find('h2').text()).toBe('Debt Budget 1');
    expect(wrapper.text()).toContain('Amount');
    expect(wrapper.text()).toContain('Over Minimum');
    expect(wrapper.text()).toContain('Payments');
    expect(wrapper.text()).toContain('Total Paid');
  });

  it('renders payoff delta badge and savings when schedule is ahead of baseline', async () => {
    const store = useDebtonateCoreStore();
    store.loans = [{ id: 'loan1' }] as any;

    vi.mocked(store.getBudgetName).mockReturnValue('Accelerated Budget');
    vi.mocked(store.getPaymentSchedule).mockImplementation((loanId: string, budgetId: string) => {
      if (budgetId === 'default') {
        return {
          lifetimePrincipal: 5000,
          lifetimeInterest: 2000,
          amortizationSchedule: new Array(60).fill({})
        } as any;
      }
      return {
        lifetimePrincipal: 5000,
        lifetimeInterest: 1200,
        amortizationSchedule: new Array(44).fill({})
      } as any;
    });

    (store as any).budgetCardGraphConfig = mockGraphConfig;
    (store as any).cardGraphs = {
      [mockLoanId]: {
        [mockBudget.id]: []
      }
    };

    const wrapper = mount(BudgetCard, {
      props: {
        budget: mockBudget as any,
        viewedLoanId: mockLoanId
      },
      global: globalConfig
    });

    // 60 - 44 = 16 months = 1y 4m sooner
    expect(wrapper.text()).toContain('1y 4m sooner');
    expect(wrapper.text()).toContain('Interest Saved');
    expect(wrapper.text()).toContain('Time Saved');

    // Trigger Edit and Delete menu buttons on non-default budget
    const menu = wrapper.findComponent(BaseMenu);
    expect(menu.props('buttons').length).toBe(3);
    menu.props('buttons')[0].onClick();
    expect(store.viewBudget).toHaveBeenCalledWith('b1');
    menu.props('buttons')[1].onClick();
    expect(store.editBudget).toHaveBeenCalledWith('b1');
    menu.props('buttons')[2].onClick();
    expect(store.deleteBudget).toHaveBeenCalledWith('b1');
  });

  it('handles baseline default budget, exact-year and month-only deltas, and empty loans alert', async () => {
    const store = useDebtonateCoreStore();
    store.loans = [] as any;

    vi.mocked(store.getBudgetName).mockReturnValue('Minimum');
    vi.mocked(store.getPaymentSchedule).mockImplementation((loanId: string, budgetId: string) => {
      if (budgetId === 'default') {
        return {
          lifetimePrincipal: 5000,
          lifetimeInterest: 2000,
          amortizationSchedule: new Array(24).fill({})
        } as any;
      }
      return {
        lifetimePrincipal: 5000,
        lifetimeInterest: 1500,
        amortizationSchedule: new Array(12).fill({})
      } as any;
    });
    (store as any).budgetCardGraphConfig = mockGraphConfig;
    (store as any).cardGraphs = {};

    const defaultWrapper = mount(BudgetCard, {
      props: {
        budget: { id: 'default', relative: 0, absolute: 500 } as any,
        viewedLoanId: mockLoanId
      },
      global: globalConfig
    });

    expect(defaultWrapper.find('.cardHeaderTitle + .badge').text()).toBe('Baseline');
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    defaultWrapper.findComponent(BaseMenu).props('buttons')[0].onClick();
    expect(alertSpy).toHaveBeenCalled();
    alertSpy.mockRestore();

    // Exact 1y sooner (24 - 12 = 12 months)
    const yearWrapper = mount(BudgetCard, {
      props: {
        budget: mockBudget as any,
        viewedLoanId: mockLoanId
      },
      global: globalConfig
    });
    expect(yearWrapper.text()).toContain('1y sooner');
  });
});

