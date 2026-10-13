import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import HoverTemplate from '@/apps/shared/components/HoverTemplate.vue';
import { TooltipConfig } from '@/apps/shared/types/graph';

describe('HoverTemplate Component', () => {
  const mockTooltipConfig: TooltipConfig = {
    color: vi.fn().mockReturnValue('#ff0000'),
    lineName: vi.fn().mockImplementation((id: string) => `Series ${id}`),
    lines: {
      l1: [
        { x: 1, y: 100 },
        { x: 2, y: 200 },
        { x: 3, y: 300 },
      ],
      l2: [
        { x: 0, y: 500 },
        { x: 10, y: 500 },
      ],
    },
    xLabel: 'Month',
    xFormat: vi.fn().mockImplementation((idx: number) => `M${idx}`),
    yFormat: vi.fn().mockImplementation((val: number) => `$${val}`),
    seriesLabel: 'Budget',
    valueLabel: 'Balance',
  };

  it('renders x-axis label, formatted index badge, headers, and series data', () => {
    const updateSizeSpy = vi.fn();

    const wrapper = mount(HoverTemplate, {
      props: {
        tooltipConfig: mockTooltipConfig,
        index: 2,
        updateTooltipSize: updateSizeSpy,
      },
    });

    expect(wrapper.text()).toContain('Month');
    expect(wrapper.text()).toContain('M2');
    expect(wrapper.text()).toContain('Budget');
    expect(wrapper.text()).toContain('Balance');

    expect(wrapper.text()).toContain('Series l1');
    expect(wrapper.text()).toContain('$200');

    // Horizontal line l2: same y value everywhere
    expect(wrapper.text()).toContain('Series l2');
    expect(wrapper.text()).toContain('$500');

    expect(updateSizeSpy).toHaveBeenCalled();
  });

  it('handles empty line array gracefully', () => {
    const configWithEmpty: TooltipConfig = {
      ...mockTooltipConfig,
      lines: {
        l_empty: [],
      },
    };

    const wrapper = mount(HoverTemplate, {
      props: {
        tooltipConfig: configWithEmpty,
        index: 5,
      },
    });

    expect(wrapper.text()).toContain('Series l_empty');
    expect(wrapper.text()).toContain('$0');
  });
});
