import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { setActivePinia } from 'pinia';

import LoanCard from '@/apps/debtonate/components/LoanCard.vue';
import { useDebtonateCoreStore } from '@/apps/debtonate/stores/core';
import BaseCard from '@/apps/shared/components/ui/BaseCard.vue';
import BaseMenu from '@/apps/shared/components/ui/BaseMenu.vue';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';
import BaseTable from '@/apps/shared/components/ui/BaseTable.vue';
import DonutGraph from '@/apps/shared/components/ui/DonutGraph.vue';
import ColorDot from '@/apps/shared/components/ColorDot.vue';

describe('LoanCard Component (Debtonate)', () => {
  const mockLoan = {
    id: 'loan1',
    name: 'Car Loan',
    principal: 20000,
    currentBalance: 18000,
    annualRate: 0.05,
    termInYears: 5,
    minPayment: 380,
    fees: 0
  };
  const mockBudgetId = 'budget1';

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
    header: vi.fn().mockReturnValue('Loan Cost Header'),
    id: 'loanDonut',
    type: 'donut'
  };

  it('renders correctly', async () => {
    const store = useDebtonateCoreStore();
    store.loans = [mockLoan] as any;

    vi.mocked(store.getLoanName).mockReturnValue('Car Loan');
    (store as any).loanCardGraphConfig = mockGraphConfig;
    (store as any).cardGraphs = {
      [mockLoan.id]: {
        [mockBudgetId]: [
          { label: 'Lifetime Interest', value: 2500, color: 'red' },
          { label: 'Lifetime Principal', value: 18000, color: 'blue' }
        ]
      }
    };

    const wrapper = mount(LoanCard, {
      props: {
        loan: mockLoan as any,
        viewedBudgetId: mockBudgetId
      },
      global: globalConfig
    });

    expect(wrapper.find('h2').text()).toBe('Car Loan');
    expect(wrapper.findComponent(DonutGraph).exists()).toBe(true);
    expect(wrapper.text()).toContain('Total Paid');
    expect(wrapper.text()).toContain('Original Principal');
  });

  it('renders Totals card with Aggregate badge, fees, and executes menu actions', async () => {
    const store = useDebtonateCoreStore();
    const totalsLoan = {
      ...mockLoan,
      id: 'totals',
      currentBalance: 20000,
      fees: 250,
    };
    store.loans = [mockLoan] as any;
    vi.mocked(store.getLoanName).mockReturnValue('Totals');
    (store as any).loanCardGraphConfig = mockGraphConfig;
    (store as any).cardGraphs = {
      totals: {
        [mockBudgetId]: []
      }
    };

    const totalsWrapper = mount(LoanCard, {
      props: {
        loan: totalsLoan as any,
        viewedBudgetId: mockBudgetId
      },
      global: globalConfig
    });

    expect(totalsWrapper.find('.cardHeaderTitle + .badge').text()).toBe('Aggregate');
    expect(totalsWrapper.text()).toContain('Fees');

    const totalsMenu = totalsWrapper.findComponent(BaseMenu);
    expect(totalsMenu.props('buttons').length).toBe(2);
    totalsMenu.props('buttons')[0].onClick();
    expect(store.viewLoan).toHaveBeenCalledWith('totals');
    totalsMenu.props('buttons')[1].onClick();
    expect(store.refinanceLoan).toHaveBeenCalledWith('totals');

    // Individual loan menu actions (Details, Refinance, Edit, Delete)
    const itemWrapper = mount(LoanCard, {
      props: {
        loan: mockLoan as any,
        viewedBudgetId: mockBudgetId
      },
      global: globalConfig
    });
    const itemMenu = itemWrapper.findComponent(BaseMenu);
    expect(itemMenu.props('buttons').length).toBe(4);
    itemMenu.props('buttons')[2].onClick();
    expect(store.editLoan).toHaveBeenCalledWith('loan1');
    itemMenu.props('buttons')[3].onClick();
    expect(store.deleteLoan).toHaveBeenCalledWith('loan1');

    // Empty loans alert guard
    store.loans = [] as any;
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    totalsMenu.props('buttons')[0].onClick();
    totalsMenu.props('buttons')[1].onClick();
    expect(alertSpy).toHaveBeenCalledTimes(2);
    alertSpy.mockRestore();
  });
});

