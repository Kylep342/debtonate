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
});
