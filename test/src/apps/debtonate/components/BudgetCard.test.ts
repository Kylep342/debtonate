import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { setActivePinia } from 'pinia';

import BudgetCard from '@/apps/debtonate/components/BudgetCard.vue';
import constants from '@/apps/debtonate/constants/constants';
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
    store.cardGraphs = {
      [mockLoanId]: {
        [mockBudget.id]: [
          { label: 'Interest', value: 1000, color: 'red' },
          { label: 'Principal', value: 2000, color: 'blue' }
        ]
      }
    } as any;

    const wrapper = mount(BudgetCard, {
      props: {
        budget: mockBudget as any,
        viewedLoanId: mockLoanId
      },
      global: globalConfig
    });

    expect(wrapper.find('h2').text()).toBe('Debt Budget 1');
    expect(wrapper.text()).toContain('Amount');
    expect(wrapper.text()).toContain('Payments');
    expect(wrapper.text()).toContain('Total Paid');
  });
});
