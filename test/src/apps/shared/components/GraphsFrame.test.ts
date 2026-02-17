import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import GraphsFrame from '@/apps/shared/components/GraphsFrame.vue';
import BaseMenu from '@/apps/shared/components/ui/BaseMenu.vue';
import BaseTabs from '@/apps/shared/components/ui/BaseTabs.vue';
import BaseGraph from '@/apps/shared/components/ui/BaseGraph.vue';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';

describe('GraphsFrame Component', () => {
  beforeEach(() => {
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }));
  });

  const mockGraphs = {
    'Graph 1': {
      id: 'g1',
      header: (id: string) => `Header ${id}`,
      subheader: (id: string) => `Subheader ${id}`,
      xScale: () => {},
      yScale: () => {},
      x: (v: any) => v,
      y: (v: any) => v,
      graphs: { item1: { lines: [], config: {} } }
    } as any,
    'Graph 2': {
      id: 'g2',
      header: (id: string) => `Header ${id}`,
      subheader: (id: string) => `Subheader ${id}`,
      xScale: () => {},
      yScale: () => {},
      x: (v: any) => v,
      y: (v: any) => v,
      graphs: { item1: { lines: [], config: {} } }
    } as any,
  };

  const mockPivotItems = [{ id: 'item1' }, { id: 'item2' }];
  const mockWatchedItems = [{ id: 'item1' }, { id: 'item2' }];
  const mockGetItemName = (id: string) => `Name ${id}`;

  const globalConfig = {
    components: {
      BaseMenu,
      BaseTabs,
      BaseGraph,
      BaseButton
    }
  };

  it('renders initial graph correctly', () => {
    const wrapper = mount(GraphsFrame, {
      props: {
        graphs: mockGraphs,
        pivotItems: mockPivotItems,
        watchedItems: mockWatchedItems,
        getItemName: mockGetItemName,
        initialItemId: 'item1',
        initialGraphId: 'Graph 1'
      },
      global: globalConfig
    });

    expect(wrapper.find('h2').text()).toBe('Graph 1');
    expect(wrapper.findComponent(BaseTabs).exists()).toBe(true);
    expect(wrapper.findComponent(BaseGraph).exists()).toBe(true);
  });

  it('switches between graphs via menu', async () => {
    const wrapper = mount(GraphsFrame, {
      props: {
        graphs: mockGraphs,
        pivotItems: mockPivotItems,
        watchedItems: mockWatchedItems,
        getItemName: mockGetItemName,
        initialItemId: 'item1',
        initialGraphId: 'Graph 1'
      },
      global: globalConfig
    });

    // Find the menu and trigger the "Graph 2" click
    // Note: BaseMenu renders <li> for buttons
    const menuItems = wrapper.findAll('li');
    // Find the one with "Graph 2"
    const graph2Btn = menuItems.find(li => li.text() === 'Graph 2');
    await graph2Btn?.trigger('click');

    expect(wrapper.find('h2').text()).toBe('Graph 2');
  });

  it('renders extra views correctly', async () => {
    const wrapper = mount(GraphsFrame, {
      props: {
        graphs: mockGraphs,
        extraViewIds: ['Extra View'],
        pivotItems: mockPivotItems,
        watchedItems: mockWatchedItems,
        getItemName: mockGetItemName,
        initialItemId: 'item1',
        initialGraphId: 'Graph 1'
      },
      slots: {
        'view-Extra View': '<div class="extra">Extra Content</div>'
      },
      global: globalConfig
    });

    // Switch to Extra View
    const menuItems = wrapper.findAll('li');
    const extraBtn = menuItems.find(li => li.text() === 'Extra View');
    await extraBtn?.trigger('click');

    expect(wrapper.find('h2').text()).toBe('Extra View');
    expect(wrapper.find('.extra').exists()).toBe(true);
    expect(wrapper.findComponent(BaseTabs).exists()).toBe(false);
  });
});
