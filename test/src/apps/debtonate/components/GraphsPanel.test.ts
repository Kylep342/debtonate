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
});
