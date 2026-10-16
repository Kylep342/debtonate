import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import SummaryCard from '@/apps/shared/components/SummaryCard.vue';
import DonutGraph from '@/apps/shared/components/ui/DonutGraph.vue';
import elementIds from '@/apps/shared/constants/elementIds';
import { useGlobalOptionsStore } from '@/apps/shared/stores/globalOptions';

describe('SummaryCard Component', () => {
  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn });
    setActivePinia(pinia);
  });

  const baseProps = {
    anchorId: 'card-1',
    title: 'Primary Card',
    subtitle: '5.00% APR · $400/month',
    menuButtons: [
      { text: 'Details', onClick: vi.fn() },
      { text: 'Edit', onClick: vi.fn() },
    ],
  };

  it('renders header title, subtitle, badge, and metric rows', () => {
    const globalOptions = useGlobalOptionsStore();
    vi.mocked(globalOptions.Money).mockImplementation((val: any) => `$${val}`);

    const wrapper = mount(SummaryCard, {
      props: {
        ...baseProps,
        badge: { text: 'Optimal', badgeClass: 'badge-success' },
        isBaseline: true,
        metrics: [
          { label: 'Principal', value: '$20,000', tooltip: 'Initial loan amount' },
          {
            label: 'Withdrawal Rate',
            value: '3.80%',
            badge: { text: '4% Rule', badgeClass: 'badge-info' },
          },
        ],
      },
    });

    expect(wrapper.find('h2.cardHeaderTitle').text()).toBe('Primary Card');
    expect(wrapper.find('.cardHeaderTitle + .badge').text()).toBe('Optimal');
    expect(wrapper.find('.cardHeaderSubtitle').text()).toBe('5.00% APR · $400/month');
    expect(wrapper.classes()).toContain('border-primary/25');
    expect(wrapper.text()).toContain('Principal');
    expect(wrapper.text()).toContain('$20,000');
    expect(wrapper.text()).toContain('4% Rule');
  });

  it('renders DonutGraph, composition bar, and slice percentages when showGraph is true', () => {
    const globalOptions = useGlobalOptionsStore();
    vi.mocked(globalOptions.Money).mockImplementation((val: any) => `$${val}`);

    const wrapper = mount(SummaryCard, {
      props: {
        ...baseProps,
        showGraph: true,
        graphHeader: 'Cost Breakdown',
        graphConfig: { id: 'donut' },
        graphContent: [
          { label: 'Interest', value: 2500, color: '#ef4444' },
          { label: 'Principal', value: 7500, color: '#3b82f6' },
        ],
      },
    });

    expect(wrapper.find('h3').text()).toBe('Cost Breakdown');
    const donut = wrapper.findComponent(DonutGraph);
    expect(donut.exists()).toBe(true);
    expect(donut.props('centerLabel')).toBe('Interest');
    expect(donut.props('centerValue')).toBe('25%');

    expect(wrapper.find('.composition-bar').exists()).toBe(true);
    expect(wrapper.text()).toContain('25%');
    expect(wrapper.text()).toContain('75%');
  });

  it('toggles collapsed state via header button and exposed methods', async () => {
    const wrapper = mount(SummaryCard, {
      props: {
        ...baseProps,
        metrics: [{ label: 'Principal', value: '$10,000' }],
      },
    });

    const collapseBtn = wrapper.find(`#${elementIds.BTN_CARD_COLLAPSE_PREFIX}-card-1`);
    expect(collapseBtn.exists()).toBe(true);
    expect(collapseBtn.text()).toBe('-');
    expect(wrapper.text()).toContain('Principal');

    await collapseBtn.trigger('click');
    expect(collapseBtn.text()).toBe('+');
    expect(wrapper.text()).not.toContain('Principal');

    await (wrapper.vm as any).expand();
    expect(wrapper.text()).toContain('Principal');

    await (wrapper.vm as any).collapse();
    expect(wrapper.text()).not.toContain('Principal');
  });

  it('mounts cleanly in isolation without Pinia using fallback money formatting', () => {
    const wrapper = mount(SummaryCard, {
      props: {
        ...baseProps,
        showGraph: true,
        graphContent: [
          { label: 'Slice A', value: 0, color: 'red' },
          { label: 'Slice B', value: 1000, color: 'blue' },
        ],
      },
    });

    expect(wrapper.text()).toContain('Slice A');
    expect(wrapper.text()).toContain('0%');
    expect(wrapper.text()).toContain('100%');
  });
});
