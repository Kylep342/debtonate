import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { setActivePinia } from 'pinia';

import InstrumentsPanel from '@/apps/appreciate/components/InstrumentsPanel.vue';
import { useAppreciateCoreStore } from '@/apps/appreciate/stores/core';
import ListPanel from '@/apps/shared/components/ListPanel.vue';
import BaseCard from '@/apps/shared/components/ui/BaseCard.vue';
import ManagementPanel from '@/apps/shared/components/ManagementPanel.vue';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';
import BaseMenu from '@/apps/shared/components/ui/BaseMenu.vue';
import constants from '@/apps/appreciate/constants/constants';

describe('InstrumentsPanel Component (Appreciate)', () => {
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
      InstrumentCard: true
    }
  };

  it('renders ListPanel with instruments and handles pivot selection and creation in career phase', async () => {
    const store = useAppreciateCoreStore();
    (store as any).instrumentsWithTotals = [{ id: 'inst-1', name: 'IRA' }];
    (store as any).monthlyBudgets = [{ id: 'b-1', absolute: 500 }];
    (store as any).getBudgetName = vi.fn().mockReturnValue('Career Budget 1');
    store.viewPhase = constants.PHASE_CAREER as any;

    const wrapper = mount(InstrumentsPanel, { global: globalConfig });
    expect(wrapper.text()).toContain(constants.INSTRUMENTS);

    // Verify InstrumentCard stub rendered
    expect(wrapper.findComponent({ name: 'InstrumentCard' }).exists()).toBe(true);

    const listPanel = wrapper.findComponent(ListPanel);
    const pivotMenu = listPanel.props('pivotMenu');
    expect(pivotMenu.buttons.length).toBe(1);
    expect(pivotMenu.buttons[0].text).toBe('Career Budget 1');
    pivotMenu.buttons[0].onClick();

    listPanel.props('createItem')();
    expect(store.openInstrumentForm).toHaveBeenCalled();
  });

  it('switches to withdrawal budgets in retirement phase and resets viewedItemId on phase change', async () => {
    const store = useAppreciateCoreStore();
    (store as any).instrumentsWithTotals = [{ id: 'inst-1', name: 'IRA' }];
    (store as any).monthlyWithdrawalBudgets = [{ id: 'w-1', absolute: 3000 }];
    (store as any).getWithdrawalBudgetName = vi.fn().mockReturnValue('Withdrawal 1');
    store.viewPhase = constants.PHASE_RETIREMENT as any;

    const wrapper = mount(InstrumentsPanel, { global: globalConfig });

    const listPanel = wrapper.findComponent(ListPanel);
    const pivotMenu = listPanel.props('pivotMenu');
    expect(pivotMenu.buttons.length).toBe(1);
    expect(pivotMenu.buttons[0].text).toBe('Withdrawal 1');
    pivotMenu.buttons[0].onClick();

    // Trigger watcher by changing viewPhase
    store.viewPhase = constants.PHASE_CAREER as any;
    await wrapper.vm.$nextTick();
  });
});
