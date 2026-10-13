import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { setActivePinia } from 'pinia';

import TabularAnalysis from '@/apps/shared/components/TabularAnalysis.vue';
import * as exportUtils from '@/apps/shared/functions/export';

describe('TabularAnalysis Component', () => {
  const mockAnalysis = {
    'Metric 1': { 'b1': '$100.00', 'b2': '$200.00' },
    'Metric 2': { 'b1': '1.2345', 'b2': '2.3456' },
  };

  const mockItems = [
    { id: 'b1' },
    { id: 'b2' },
  ];

  const mockGetItemName = (id: string) => id === 'b1' ? 'Item One' : 'Item Two';

  it('renders the title and metrics correctly', async () => {
    const pinia = createTestingPinia({ createSpy: vi.fn });
    setActivePinia(pinia);

    const wrapper = mount(TabularAnalysis, {
      props: {
        analysis: mockAnalysis,
        items: mockItems as any,
        title: 'Test Analysis Table',
        getItemName: mockGetItemName
      },
      global: {
        plugins: [pinia],
      }
    });

    await nextTick();

    expect(wrapper.find('h3').text()).toBe('Test Analysis Table');

    const headers = wrapper.findAll('th');
    expect(headers[0].text()).toBe('Metric');
    expect(headers[1].text()).toBe('Item One');
    expect(headers[2].text()).toBe('Item Two');

    const rows = wrapper.findAll('tbody tr');
    expect(rows.length).toBe(2);

    expect(rows[0].find('td:first-child').text()).toBe('Metric 1');
    expect(rows[0].findAll('td')[1].text()).toBe('$100.00');
    expect(rows[0].findAll('td')[2].text()).toBe('$200.00');
  });

  it('toggles deltas when delta toggle button is clicked', async () => {
    const pinia = createTestingPinia({ createSpy: vi.fn });
    setActivePinia(pinia);

    const wrapper = mount(TabularAnalysis, {
      props: {
        analysis: mockAnalysis,
        items: mockItems as any,
        title: 'Test Analysis Table',
        getItemName: mockGetItemName,
      },
      global: {
        plugins: [pinia],
      },
    });

    await nextTick();

    const deltaBtn = wrapper.findAll('button').find(b => b.text().includes('Deltas'));
    expect(deltaBtn?.exists()).toBe(true);
    expect(deltaBtn?.text()).toBe('Show Deltas (Δ)');

    await deltaBtn?.trigger('click');
    expect(deltaBtn?.text()).toBe('Hide Deltas (Δ)');

    // Row 0, Item 2 should now display delta
    expect(wrapper.text()).toContain('+$100 (+100%)');
  });

  it('renders export buttons and triggers export with stateHash suffix', async () => {
    const pinia = createTestingPinia({ createSpy: vi.fn });
    setActivePinia(pinia);

    const csvSpy = vi.spyOn(exportUtils, 'exportToCsv').mockImplementation(() => {});
    const jsonSpy = vi.spyOn(exportUtils, 'exportToJson').mockImplementation(() => {});

    const wrapper = mount(TabularAnalysis, {
      props: {
        analysis: mockAnalysis,
        items: mockItems as any,
        title: 'Test Analysis Table',
        getItemName: mockGetItemName,
        stateHash: 'c0ffee01',
      },
      global: {
        plugins: [pinia],
      },
    });

    await nextTick();

    const csvBtn = wrapper.findAll('button').find(b => b.text() === 'CSV');
    const jsonBtn = wrapper.findAll('button').find(b => b.text() === 'JSON');
    expect(csvBtn?.exists()).toBe(true);
    expect(jsonBtn?.exists()).toBe(true);

    await csvBtn!.trigger('click');
    expect(csvSpy).toHaveBeenCalledWith('test_analysis_table_c0ffee01', expect.any(Array), expect.any(Array));

    await jsonBtn!.trigger('click');
    expect(jsonSpy).toHaveBeenCalledWith('test_analysis_table_c0ffee01', expect.any(Object));
  });

  it('sorts baseline item first, shows Baseline badge, enables deltas, and emits selectBaseline on header click', async () => {
    const pinia = createTestingPinia({ createSpy: vi.fn });
    setActivePinia(pinia);

    const wrapper = mount(TabularAnalysis, {
      props: {
        analysis: mockAnalysis,
        items: mockItems as any,
        title: 'Test Analysis Table',
        getItemName: mockGetItemName,
        baselineId: 'b2',
      },
      global: {
        plugins: [pinia],
      },
    });

    await nextTick();

    // Headers should have b2 (Item Two) first
    const headers = wrapper.findAll('th');
    expect(headers[1].text()).toContain('Item Two');
    expect(headers[1].text()).toContain('Baseline');
    expect(headers[2].text()).toBe('Item One');

    // Deltas are shown by default when baselineId is set
    // Item 1 ($100) vs baseline Item 2 ($200) -> diff -100 (-50%)
    expect(wrapper.text()).toContain('-$100 (-50%)');

    // Clicking header of Item One emits selectBaseline with 'b1'
    await headers[2].trigger('click');
    expect(wrapper.emitted('selectBaseline')).toBeTruthy();
    expect(wrapper.emitted('selectBaseline')![0]).toEqual(['b1']);
  });

  it('renders metric subtitles for Title Case Appreciate metrics and Earliest $1M Milestone summary card', async () => {
    const pinia = createTestingPinia({ createSpy: vi.fn });
    setActivePinia(pinia);

    const appreciateAnalysis = {
      'Growth/Initial Ratio': { b1: '1.4500', b2: '2.1000' },
      'Age of > $1M Saved': { b1: '52', b2: '46' },
      'Safe Withdrawal Rate': { b1: '4.00%', b2: '4.25%' },
    };

    const wrapper = mount(TabularAnalysis, {
      props: {
        analysis: appreciateAnalysis,
        items: mockItems as any,
        title: 'Appreciate Analysis',
        getItemName: mockGetItemName,
      },
      global: {
        plugins: [pinia],
      },
    });

    await nextTick();

    // Verify row subtitles appear from metricTooltips
    expect(wrapper.text()).toContain('Ratio of investment returns earned during retirement to starting balance.');
    expect(wrapper.text()).toContain('Estimated age when total investment balance surpasses $1,000,000.');
    expect(wrapper.text()).toContain('Sustainable annual distribution rate from your nest egg.');

    // Verify summary highlight cards: Earliest $1M Milestone should pick b2 (age 46, lower is better)
    expect(wrapper.text()).toContain('Earliest $1M Milestone');
    expect(wrapper.text()).toContain('Item Two');
    expect(wrapper.text()).toContain('46 years old');
  });
});
