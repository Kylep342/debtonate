import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { setActivePinia } from 'pinia';

import BudgetCard from '@/apps/appreciate/components/BudgetCard.vue';
import constants from '@/apps/appreciate/constants/constants';
import { useAppreciateCoreStore } from '@/apps/appreciate/stores/core';
import BaseCard from '@/apps/shared/components/ui/BaseCard.vue';
import BaseMenu from '@/apps/shared/components/ui/BaseMenu.vue';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';
import BaseTable from '@/apps/shared/components/ui/BaseTable.vue';
import DonutGraph from '@/apps/shared/components/ui/DonutGraph.vue';
import ColorDot from '@/apps/shared/components/ColorDot.vue';

describe('BudgetCard Component (Appreciate)', () => {
  const mockBudget = { id: 'b1', relative: 1000, absolute: 1000 };
  const mockInstrumentId = 'inst1';

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
    header: vi.fn().mockReturnValue('Yield Header'),
    id: 'test',
    type: 'donut',
    color: vi.fn(),
    lineName: vi.fn(),
    subheader: vi.fn(),
    x: vi.fn(),
    xFormat: vi.fn(),
    xLabel: vi.fn(),
    xScale: vi.fn(),
    y: vi.fn(),
    yFormat: vi.fn(),
    yLabel: vi.fn(),
    yScale: vi.fn(),
  };

  it('renders Career phase correctly', async () => {
    const store = useAppreciateCoreStore();
    store.viewPhase = constants.PHASE_CAREER;
    store.instruments = [{ id: 'inst1' }] as any;

    // Mock getters/state
    vi.mocked(store.getBudgetName).mockReturnValue('Career Budget 1');
    vi.mocked(store.getContributionSchedule).mockReturnValue({
      lifetimeContribution: 5000,
      lifetimeGrowth: 2000,
      amortizationSchedule: new Array(120).fill({})
    } as any);

    (store as any).budgetCardGraphConfig = mockGraphConfig;
    store.cardGraphs = {
      [mockInstrumentId]: {
        [mockBudget.id]: [
          { label: 'Growth', value: 1000, color: 'green' },
          { label: 'Contribution', value: 2000, color: 'blue' }
        ]
      }
    } as any;

    const wrapper = mount(BudgetCard, {
      props: {
        budget: mockBudget as any,
        viewedInstrumentId: mockInstrumentId
      },
      global: globalConfig
    });

    expect(wrapper.find('h2').text()).toBe('Career Budget 1');
    expect(wrapper.text()).toContain('Retirement Balance');
    expect(wrapper.text()).toContain('Contributions');
  });

  it('renders Retirement phase correctly', async () => {
    const store = useAppreciateCoreStore();
    store.viewPhase = constants.PHASE_RETIREMENT;
    store.instruments = [{ id: 'inst1' }] as any;

    // Mock getters/state
    vi.mocked(store.getWithdrawalBudgetName).mockReturnValue('Withdrawal Budget 1');
    vi.mocked(store.getWithdrawalSchedule).mockReturnValue({
      lifetimeGrowth: 1000,
      lifetimeWithdrawal: 5000,
      amortizationSchedule: [{ currentBalance: 500 }]
    } as any);
    (store as any).budgetCardGraphConfig = mockGraphConfig;

    const wrapper = mount(BudgetCard, {
      props: {
        budget: mockBudget as any,
        viewedInstrumentId: mockInstrumentId
      },
      global: globalConfig
    });

    expect(wrapper.find('h2').text()).toBe('Withdrawal Budget 1');
    expect(wrapper.text()).toContain('Ending Balance');
    expect(wrapper.text()).toContain('Withdrawals');
  });
});
