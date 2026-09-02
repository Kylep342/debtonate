import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { setActivePinia } from 'pinia';

import LoansPanel from '@/apps/debtonate/components/LoansPanel.vue';
import { useDebtonateCoreStore } from '@/apps/debtonate/stores/core';
import ListPanel from '@/apps/shared/components/ListPanel.vue';
import BaseCard from '@/apps/shared/components/ui/BaseCard.vue';
import ManagementPanel from '@/apps/shared/components/ManagementPanel.vue';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';
import BaseMenu from '@/apps/shared/components/ui/BaseMenu.vue';
import constants from '@/apps/debtonate/constants/constants';

describe('LoansPanel Component (Debtonate)', () => {
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
      LoanCard: true
    }
  };

  it('renders ListPanel with loans and title', async () => {
    const store = useDebtonateCoreStore();
    (store as any).loansWithTotals = [];
    (store as any).monthlyBudgets = [];

    const wrapper = mount(LoansPanel, { global: globalConfig });
    expect(wrapper.text()).toContain(constants.LOANS);
  });
});
