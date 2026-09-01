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
  });
});
