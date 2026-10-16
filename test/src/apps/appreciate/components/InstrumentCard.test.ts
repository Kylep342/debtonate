import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { setActivePinia } from 'pinia';

import InstrumentCard from '@/apps/appreciate/components/InstrumentCard.vue';
import { useAppreciateCoreStore } from '@/apps/appreciate/stores/core';
import BaseCard from '@/apps/shared/components/ui/BaseCard.vue';
import BaseMenu from '@/apps/shared/components/ui/BaseMenu.vue';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';
import BaseTable from '@/apps/shared/components/ui/BaseTable.vue';
import DonutGraph from '@/apps/shared/components/ui/DonutGraph.vue';
import ColorDot from '@/apps/shared/components/ColorDot.vue';

describe('InstrumentCard Component (Appreciate)', () => {
  const mockInstrument = {
    id: 'inst1',
    name: 'Index Fund',
    currentBalance: 10000,
    annualRate: 0.08,
    annualLimit: 23000
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
    header: vi.fn().mockReturnValue('Investment Cost Header'),
    id: 'instrumentDonut',
    type: 'donut'
  };

  it('renders correctly', async () => {
    const store = useAppreciateCoreStore();
    store.instruments = [mockInstrument] as any;

    vi.mocked(store.getInstrumentName).mockReturnValue('Index Fund');
    (store as any).instrumentCardGraphConfig = mockGraphConfig;
    (store as any).cardGraphs = {
      [mockInstrument.id]: {
        [mockBudgetId]: [
          { label: 'Lifetime Growth', value: 80000, color: 'green' },
          { label: 'Lifetime Contribution', value: 50000, color: 'blue' }
        ]
      }
    };

    const wrapper = mount(InstrumentCard, {
      props: {
        instrument: mockInstrument as any,
        viewedBudgetId: mockBudgetId
      },
      global: globalConfig
    });

    expect(wrapper.find('h2').text()).toBe('Index Fund');
    expect(wrapper.findComponent(DonutGraph).exists()).toBe(true);
    expect(wrapper.text()).toContain('Expected Return');
    expect(wrapper.text()).toContain('Annual Limit');

    const menu = wrapper.findComponent(BaseMenu);
    expect(menu.props('buttons').length).toBe(3);
    menu.props('buttons')[0].onClick();
    expect(store.viewInstrument).toHaveBeenCalledWith('inst1');
    menu.props('buttons')[1].onClick();
    expect(store.editInstrument).toHaveBeenCalledWith('inst1');
    menu.props('buttons')[2].onClick();
    expect(store.deleteInstrument).toHaveBeenCalledWith('inst1');
  });

  it('renders Retirement phase and Totals aggregate card correctly', async () => {
    const store = useAppreciateCoreStore();
    store.viewPhase = 'retirement' as any;
    store.instruments = [mockInstrument] as any;

    vi.mocked(store.getInstrumentName).mockReturnValue('Totals');
    vi.mocked(store.getContributionSchedule).mockReturnValue({
      amortizationSchedule: [{ currentBalance: 250000 }]
    } as any);
    (store as any).instrumentCardGraphConfig = mockGraphConfig;
    (store as any).withdrawalSchedules = {
      totals: {
        [mockBudgetId]: {
          lifetimeGrowth: 120000,
          lifetimeWithdrawal: 180000,
        }
      }
    };

    const wrapper = mount(InstrumentCard, {
      props: {
        instrument: { ...mockInstrument, id: 'totals' } as any,
        viewedBudgetId: mockBudgetId
      },
      global: globalConfig
    });

    expect(wrapper.find('.cardHeaderTitle + .badge').text()).toBe('Aggregate');
    expect(wrapper.text()).toContain('Starting Balance');
    expect(wrapper.findComponent(BaseMenu).props('buttons').length).toBe(1);

    // Empty instruments alert guard
    store.instruments = [] as any;
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    wrapper.findComponent(BaseMenu).props('buttons')[0].onClick();
    expect(alertSpy).toHaveBeenCalled();
    alertSpy.mockRestore();
  });
});

