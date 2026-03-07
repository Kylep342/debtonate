import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import BaseTable from '@/apps/shared/components/ui/BaseTable.vue';

describe('BaseTable Component', () => {
  it('renders correctly with slots', () => {
    const wrapper = mount(BaseTable, {
      slots: {
        header: '<thead><tr><th>H1</th></tr></thead>',
        body: '<tbody><tr><td>B1</td></tr></tbody>',
        footer: '<tfoot><tr><td>F1</td></tr></tfoot>'
      }
    });

    expect(wrapper.find('th').text()).toBe('H1');
    expect(wrapper.find('td').text()).toBe('B1');
    expect(wrapper.find('tfoot td').text()).toBe('F1');
    expect(wrapper.find('table').classes()).toContain('table');
    expect(wrapper.find('table').classes()).toContain('table-pin-rows');
  });
});
