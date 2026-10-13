import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { setActivePinia } from 'pinia';

import InvestigateApplet from '@/apps/appreciate/investigate/InvestigateApplet.vue';
import GraphsPanel from '@/apps/appreciate/components/GraphsPanel.vue';
import { useAppreciateCoreStore } from '@/apps/appreciate/stores/core';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';
import BaseMenu from '@/apps/shared/components/ui/BaseMenu.vue';
import constants from '@/apps/appreciate/constants/constants';

describe('InvestigateApplet Component (Appreciate)', () => {
  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn });
    setActivePinia(pinia);
  });

  const globalConfig = {
    components: {
      BaseButton,
      BaseMenu,
    },
    stubs: {
      GraphsPanel: {
        name: 'GraphsPanel',
        template: '<div class="graphs-panel-stub"><slot name="extraPivot" /></div>',
        props: ['extraViewIds'],
      },
    },
  };

  it('renders retirement analysis heading and pure graph section with career pivot', () => {
    const store = useAppreciateCoreStore();
    (store as any).monthlyBudgets = [
      { id: constants.DEFAULT, relative: 0, absolute: 500 },
      { id: 'b1', relative: 500, absolute: 1000 },
    ];
    store.selectedCareerBudgetId = constants.DEFAULT;
    vi.mocked(store.getBudgetName).mockImplementation((id: string) => {
      return id === constants.DEFAULT ? 'Minimum Budget' : 'Budget 1';
    });

    const wrapper = mount(InvestigateApplet, { global: globalConfig });

    expect(wrapper.text()).toContain('Retirement Analysis');
    expect(wrapper.find('.graphs-panel-stub').exists()).toBe(true);

    const graphsPanel = wrapper.findComponent(GraphsPanel);
    expect(graphsPanel.props('extraViewIds')).toBeUndefined();

    // Verify career pivot dropdown in extraPivot slot
    expect(wrapper.text()).toContain('From Career: Minimum Budget');

    // Verify no retirement summary table is rendered
    expect(wrapper.text()).not.toContain('Retirement Comparison (by Career Budget)');
  });
});
