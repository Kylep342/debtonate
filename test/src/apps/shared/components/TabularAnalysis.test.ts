import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import { setActivePinia } from 'pinia';

import TabularAnalysis from '@/apps/shared/components/TabularAnalysis.vue';

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

  it('renders export buttons and triggers export', async () => {
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

    const csvBtn = wrapper.findAll('button').find(b => b.text() === 'CSV');
    const jsonBtn = wrapper.findAll('button').find(b => b.text() === 'JSON');
    expect(csvBtn?.exists()).toBe(true);
    expect(jsonBtn?.exists()).toBe(true);
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
});
