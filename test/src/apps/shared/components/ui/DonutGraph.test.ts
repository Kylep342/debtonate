import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import DonutGraph from '@/apps/shared/components/ui/DonutGraph.vue';

describe('DonutGraph Component', () => {
  const mockGraph = [
    { label: 'A', value: 10, color: 'red' },
    { label: 'B', value: 20, color: 'blue' }
  ];

  it('renders svg with correct id', () => {
    const wrapper = mount(DonutGraph, {
      props: {
        config: {},
        graph: mockGraph,
        anchorId: 'test-anchor'
      }
    });

    const svg = wrapper.find('svg');
    expect(svg.exists()).toBe(true);
    expect(svg.attributes('id')).toBe('donut-graph-test-anchor');
  });

  it('renders paths for data points', async () => {
    // We attach to document body because d3.select searches the document
    const wrapper = mount(DonutGraph, {
      props: {
        config: {},
        graph: mockGraph,
        anchorId: 'test-paths'
      },
      attachTo: document.body
    });

    // D3 operations happen in onMounted/watch.
    // We need to wait for DOM updates.
    await wrapper.vm.$nextTick();

    const paths = wrapper.findAll('path');
    // D3 should have added 2 paths inside the group
    expect(paths.length).toBe(2);

    // Check colors
    expect(paths[0].attributes('fill')).toBe('red');
    expect(paths[1].attributes('fill')).toBe('blue');

    wrapper.unmount();
  });

  it('updates when graph prop changes', async () => {
    const wrapper = mount(DonutGraph, {
      props: {
        config: {},
        graph: mockGraph,
        anchorId: 'test-update'
      },
      attachTo: document.body
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('path').length).toBe(2);

    await wrapper.setProps({
      graph: [
        { label: 'A', value: 10, color: 'red' },
        { label: 'B', value: 20, color: 'blue' },
        { label: 'C', value: 30, color: 'green' }
      ]
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('path').length).toBe(3);

    wrapper.unmount();
  });
});
