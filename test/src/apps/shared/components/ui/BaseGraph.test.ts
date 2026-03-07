import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import BaseGraph from '@/apps/shared/components/ui/BaseGraph.vue';
import * as d3 from 'd3';

describe('BaseGraph Component', () => {
  let resizeCallback: ResizeObserverCallback;

  beforeEach(() => {
    // Mock getBBox for JSDOM
    if (!SVGElement.prototype.getBBox) {
      SVGElement.prototype.getBBox = vi.fn().mockReturnValue({
        x: 0,
        y: 0,
        width: 20,
        height: 20,
      });
    }

    // Mock ResizeObserver
    global.ResizeObserver = vi.fn().mockImplementation((callback) => {
      resizeCallback = callback;
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockGraphConfig = {
    id: 'test-graph',
    header: (id: string) => `Header ${id}`,
    subheader: (id: string) => `Subheader ${id}`,
    xScale: d3.scaleLinear,
    yScale: d3.scaleLinear,
    x: (v: any) => v,
    y: (v: any) => v,
    xLabel: () => 'X Axis',
    yLabel: () => 'Y Axis',
    xFormat: (x: any) => `${x}`,
    yFormat: (y: any) => `${y}`,
    color: () => 'red',
    lineName: () => 'Line 1',
    graphs: {
      'test-anchor': {
        config: { maxX: 100, maxY: 100 },
        lines: {
          'line1': [{ x: 0, y: 0 }, { x: 50, y: 50 }, { x: 100, y: 100 }]
        }
      }
    }
  };

  it('renders correctly', async () => {
    const wrapper = mount(BaseGraph, {
      props: {
        graph: mockGraphConfig,
        anchorId: 'test-anchor'
      },
      attachTo: document.body
    });

    expect(wrapper.find('h2').text()).toBe('Header test-anchor');
    expect(wrapper.find('svg').exists()).toBe(true);
    expect(wrapper.find('svg').attributes('id')).toBe('graph-test-anchor');

    // Simulate ResizeObserver callback to trigger chart initialization
    if (resizeCallback) {
      resizeCallback([
        {
          contentRect: { width: 800, height: 500 }
        } as ResizeObserverEntry
      ], {} as ResizeObserver);
    }

    // Wait for watchers/D3
    await wrapper.vm.$nextTick();

    // Check if D3 rendered something (e.g., axes, paths)
    // The svg should contain a group for margins
    const svg = wrapper.find('svg');
    expect(svg.findAll('g').length).toBeGreaterThan(0);

    // Check for the line path
    expect(svg.findAll('path').length).toBeGreaterThan(0);

    wrapper.unmount();
  });
});
