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

  it('renders ListPanel with instruments and title', async () => {
    const store = useAppreciateCoreStore();
    (store as any).instrumentsWithTotals = [];
    (store as any).monthlyBudgets = [];
    (store as any).monthlyWithdrawalBudgets = [];
    store.viewPhase = constants.PHASE_CAREER as any;

    const wrapper = mount(InstrumentsPanel, { global: globalConfig });
    expect(wrapper.text()).toContain(constants.INSTRUMENTS);
  });
});
