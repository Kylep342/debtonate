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
});
