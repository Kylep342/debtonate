import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { setActivePinia } from 'pinia';

import BudgetsPanel from '@/apps/debtonate/components/BudgetsPanel.vue';
import { useDebtonateCoreStore } from '@/apps/debtonate/stores/core';
import ListPanel from '@/apps/shared/components/ListPanel.vue';
import BaseCard from '@/apps/shared/components/ui/BaseCard.vue';
import ManagementPanel from '@/apps/shared/components/ManagementPanel.vue';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';
import BaseMenu from '@/apps/shared/components/ui/BaseMenu.vue';
import constants from '@/apps/debtonate/constants/constants';

describe('BudgetsPanel Component (Debtonate)', () => {
  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn });
    setActivePinia(pinia);
  });

  const globalConfig = {
    components: {
      ListPanel,
      BaseCard,
      ManagementPanel,
      BaseButton,
      BaseMenu
    },
    stubs: {
      BudgetCard: true
    }
  };

  it('renders correctly with budgets', async () => {
    const store = useDebtonateCoreStore();
    (store as any).loansWithTotals = [];
    (store as any).monthlyBudgets = [
      { id: constants.DEFAULT, relative: 500, absolute: 500 },
      { id: 'b1', relative: 1000, absolute: 1500 }
    ];

    const wrapper = mount(BudgetsPanel, { global: globalConfig });
    expect(wrapper.text()).toContain(constants.BUDGETS);
  });

  it('includes refinancing scenarios in pivot menu during Repatriate phase and resets when phase changes', async () => {
    const store = useDebtonateCoreStore();
    const loanItem = { id: 'loan-1', name: 'Auto Loan' };
    const scenItem = { id: 'scen-1', name: 'Refi 1' };
    (store as any).loansWithTotals = [{ id: constants.TOTALS, name: 'All Loans' }, loanItem];
    (store as any).loansWithScenarios = [{ id: constants.TOTALS, name: 'All Loans' }, loanItem, scenItem];
    (store as any).monthlyBudgets = [
      { id: constants.DEFAULT, relative: 0, absolute: 500 },
    ];
    store.viewPhase = constants.PHASE_REPATRIATE;
    vi.mocked(store.getLoanName).mockImplementation((id: string) => {
      if (id === 'scen-1') return 'Refi 1';
      if (id === 'loan-1') return 'Auto Loan';
      return 'All Loans';
    });

    const wrapper = mount(BudgetsPanel, { global: globalConfig });
    const menu = wrapper.findComponent(BaseMenu);
    const buttons = menu.props('buttons');
    expect(buttons.length).toBe(3);

    // Select scenario
    buttons[2].onClick();
    await wrapper.vm.$nextTick();

    // Switch back to Debtonate phase
    store.viewPhase = constants.PHASE_DEBTONATE;
    await wrapper.vm.$nextTick();
    expect(menu.props('buttons').length).toBe(2);
  });
});
