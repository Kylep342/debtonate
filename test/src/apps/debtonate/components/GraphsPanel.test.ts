import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { setActivePinia } from 'pinia';

import GraphsPanel from '@/apps/debtonate/components/GraphsPanel.vue';
import constants from '@/apps/debtonate/constants/constants';
import { useDebtonateCoreStore } from '@/apps/debtonate/stores/core';

describe('GraphsPanel Component (Debtonate)', () => {
  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn });
    setActivePinia(pinia);
  });

  it('binds initial-item-id to selectedLoanId and updates store when event fires', async () => {
    const store = useDebtonateCoreStore();
    store.selectedLoanId = 'loan-custom';

    const wrapper = mount(GraphsPanel, {
      global: {
        stubs: {
          GraphsFrame: {
            name: 'GraphsFrame',
            template: '<div class="graphs-frame" />',
            props: ['graphs', 'extraViewIds', 'pivotItems', 'watchedItems', 'getItemName', 'initialItemId', 'initialGraphId', 'pivotLabel'],
            emits: ['update:viewed-item-id'],
          },
        },
      },
    });

    const graphsFrame = wrapper.findComponent({ name: 'GraphsFrame' });
    expect(graphsFrame.exists()).toBe(true);
    expect(graphsFrame.props('initialItemId')).toBe('loan-custom');
    expect(graphsFrame.props('pivotLabel')).toBe('Loan');

    // Trigger update:viewed-item-id
    graphsFrame.vm.$emit('update:viewed-item-id', 'loan-2');
    expect(store.setSelectedLoanId).toHaveBeenCalledWith('loan-2');
  });

  it('falls back to constants.TOTALS when selectedLoanId is null or empty', () => {
    const store = useDebtonateCoreStore();
    store.selectedLoanId = null;

    const wrapper = mount(GraphsPanel, {
      global: {
        stubs: {
          GraphsFrame: {
            name: 'GraphsFrame',
            template: '<div class="graphs-frame" />',
            props: ['initialItemId'],
          },
        },
      },
    });

    const graphsFrame = wrapper.findComponent({ name: 'GraphsFrame' });
    expect(graphsFrame.props('initialItemId')).toBe(constants.TOTALS);
  });

  it('forwards extraPivot and dynamic extraView slots to GraphsFrame', () => {
    const wrapper = mount(GraphsPanel, {
      props: {
        extraViewIds: ['custom-tab'],
      },
      slots: {
        extraPivot: '<div data-testid="extra-pivot-content">Pivot Slot</div>',
        'view-custom-tab': '<template #default="{ viewedItemId }"><div data-testid="custom-view-content">{{ viewedItemId }}</div></template>',
      },
      global: {
        stubs: {
          GraphsFrame: {
            name: 'GraphsFrame',
            template: `
              <div class="graphs-frame">
                <slot name="extraPivot" />
                <slot name="view-custom-tab" :viewed-item-id="'test-item-id'" />
              </div>
            `,
            props: ['extraViewIds'],
          },
        },
      },
    });

    expect(wrapper.find('[data-testid="extra-pivot-content"]').text()).toBe('Pivot Slot');
    expect(wrapper.find('[data-testid="custom-view-content"]').text()).toBe('test-item-id');
  });
});
