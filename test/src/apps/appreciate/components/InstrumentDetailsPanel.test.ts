import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { nextTick } from 'vue';
import { setActivePinia } from 'pinia';

import InstrumentDetailsPanel from '@/apps/appreciate/components/InstrumentDetailsPanel.vue';
import { useAppreciateCoreStore } from '@/apps/appreciate/stores/core';
import BaseModal from '@/apps/shared/components/ui/BaseModal.vue';
import BaseCard from '@/apps/shared/components/ui/BaseCard.vue';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';
import BaseMenu from '@/apps/shared/components/ui/BaseMenu.vue';
import BaseTabs from '@/apps/shared/components/ui/BaseTabs.vue';
import BaseTable from '@/apps/shared/components/ui/BaseTable.vue';
import DataTable from '@/apps/shared/components/DataTable.vue';
import TabularAnalysis from '@/apps/shared/components/TabularAnalysis.vue';
import constants from '@/apps/appreciate/constants/constants';

describe('InstrumentDetailsPanel Component', () => {
  const mockInstrument = {
    id: 'inst-1',
    name: 'Pension Plan',
    currentBalance: 50000,
    annualRate: 0.07,
    periodsPerYear: 12,
    annualLimit: 20000,
  };

  const mockBudget = {
    id: 'b1',
    relative: 200,
    absolute: 600,
  };

  beforeEach(() => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
      initialState: {
        appreciateCore: {
          currentInstrumentId: 'inst-1',
          instrumentDetailsPanelActive: true,
          instruments: [mockInstrument],
          budgets: [mockBudget],
          viewPhase: constants.PHASE_CAREER,
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
    const store = useAppreciateCoreStore();
    vi.mocked(store.getInstrument).mockReturnValue(mockInstrument as any);
    vi.mocked(store.getInstrumentName).mockReturnValue('Pension Plan');
    vi.mocked(store.buildInstrumentSubtitle).mockReturnValue('7.00% | $50,000 balance');
    vi.mocked(store.getBudget).mockReturnValue(mockBudget as any);
    vi.mocked(store.getBudgetName).mockReturnValue('Career Budget 1');
    vi.mocked(store.getContributionSchedule).mockReturnValue({
      lifetimeGrowth: 150000n,
      lifetimeContribution: 100000n,
      amortizationSchedule: [],
    } as any);
    vi.mocked(store.getInstrumentComparativeAnalysis).mockReturnValue({
      'Final Balance': { b1: '$250,000' },
      'Interest Growth': { b1: '$150,000' },
    });

    const wrapper = mount(InstrumentDetailsPanel, {
      props: { id: 'instrumentDetailsPanel' },
      global: globalConfig,
    });

    await nextTick();

    // Verify title and stats
    expect(wrapper.text()).toContain('Pension Plan');
    expect(wrapper.text()).toContain('7.00%');

    // Budget dropdown exists
    const menu = wrapper.findComponent(BaseMenu);
    expect(menu.exists()).toBe(true);
    expect(menu.props('text')).toBe('Career Budget 1');

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

    // Crosstab content rendered
    expect(wrapper.text()).toContain('Pension Plan - Budget Comparison');
    expect(wrapper.text()).toContain('Career Budget 1');
    expect(wrapper.text()).toContain('$250,000');
  });
});
