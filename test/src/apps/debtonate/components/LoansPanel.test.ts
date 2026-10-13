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

  it('renders ListPanel with loans and title, and handles pivot selection and creation', async () => {
    const store = useDebtonateCoreStore();
    (store as any).loansWithTotals = [{ id: 'loan-1', name: 'Loan 1' }];
    (store as any).monthlyBudgets = [{ id: 'b-1', absolute: 500 }];
    (store as any).getBudgetName = vi.fn().mockReturnValue('Budget 1');

    const wrapper = mount(LoansPanel, { global: globalConfig });
    expect(wrapper.text()).toContain(constants.LOANS);

    // Verify LoanCard stub rendered for the loan item
    expect(wrapper.findComponent({ name: 'LoanCard' }).exists()).toBe(true);

    // Call pivot button onClick
    const listPanel = wrapper.findComponent(ListPanel);
    const pivotMenu = listPanel.props('pivotMenu');
    expect(pivotMenu.buttons.length).toBe(1);
    pivotMenu.buttons[0].onClick();

    // Verify createItem calls openLoanForm
    listPanel.props('createItem')();
    expect(store.openLoanForm).toHaveBeenCalled();
  });
});
