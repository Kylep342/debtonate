import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { setActivePinia } from 'pinia';

import GraphsPanel from '@/apps/appreciate/components/GraphsPanel.vue';
import constants from '@/apps/appreciate/constants/constants';
import { useAppreciateCoreStore } from '@/apps/appreciate/stores/core';

describe('GraphsPanel Component (Appreciate)', () => {
  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn });
    setActivePinia(pinia);
  });

  it('binds initial-item-id to selectedInstrumentId and updates store when event fires', async () => {
    const store = useAppreciateCoreStore();
    store.selectedInstrumentId = 'inst-custom';

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
    expect(graphsFrame.props('initialItemId')).toBe('inst-custom');
    expect(graphsFrame.props('pivotLabel')).toBe('Instrument');

    // Trigger update:viewed-item-id
    graphsFrame.vm.$emit('update:viewed-item-id', 'inst-2');
    expect(store.setSelectedInstrumentId).toHaveBeenCalledWith('inst-2');
  });

  it('falls back to constants.TOTALS when selectedInstrumentId is null or empty', () => {
    const store = useAppreciateCoreStore();
    store.selectedInstrumentId = null;

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
