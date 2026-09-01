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
  });
});
