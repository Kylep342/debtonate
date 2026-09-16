import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import DataTable from '@/apps/shared/components/DataTable.vue';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';
import BaseTable from '@/apps/shared/components/ui/BaseTable.vue';
import elementIds from '@/apps/shared/constants/elementIds';
import * as exportUtils from '@/apps/shared/functions/export';

describe('DataTable Component', () => {
  const mockHeaders = [
    { key: 'col1', label: 'Header 1' },
    { key: 'col2', label: 'Header 2', class: 'text-left' }
  ];

  const mockRows = [
    { col1: 'Val 1.1', col2: 'Val 1.2' },
    { col1: 'Val 2.1', col2: 'Val 2.2' }
  ];

  const mockTotals = {
    col1: 'Total 1',
    col2: 'Total 2'
  };

  it('renders correctly with props and export buttons', () => {
    const wrapper = mount(DataTable, {
      props: {
        title: 'Test Table',
        subtitle: 'Test Subtitle',
        headers: mockHeaders,
        rows: mockRows,
        totals: mockTotals
      },
      global: {
        components: {
          BaseButton,
          BaseTable
        }
      }
    });

    expect(wrapper.find('h3').text()).toBe('Test Table');
    expect(wrapper.find('h5').text()).toBe('Test Subtitle');

    const headers = wrapper.findAll('th');
    expect(headers.length).toBe(2);
    expect(headers[0].text()).toBe('Header 1');
    expect(headers[1].text()).toBe('Header 2');
    expect(headers[1].classes()).toContain('text-left');

    const cells = wrapper.findAll('tbody td');
    expect(cells.length).toBe(4);
    expect(cells[0].text()).toBe('Val 1.1');
    expect(cells[1].text()).toBe('Val 1.2');

    const totalCells = wrapper.findAll('tfoot td');
    expect(totalCells.length).toBe(2);
    expect(totalCells[0].text()).toBe('Total 1');
    expect(totalCells[1].text()).toBe('Total 2');

    const buttons = wrapper.findAllComponents(BaseButton);
    expect(buttons.length).toBe(2);
    expect(buttons[0].text()).toBe('Export CSV');
    expect(buttons[1].text()).toBe('Export JSON');
  });

  it('triggers exportToCsv and exportToJson when buttons clicked', async () => {
    const csvSpy = vi.spyOn(exportUtils, 'exportToCsv').mockImplementation(() => {});
    const jsonSpy = vi.spyOn(exportUtils, 'exportToJson').mockImplementation(() => {});

    const wrapper = mount(DataTable, {
      props: {
        title: 'Mortgage Schedule',
        subtitle: '30 Year Fixed',
        headers: mockHeaders,
        rows: mockRows,
        totals: mockTotals
      },
      global: {
        components: {
          BaseButton,
          BaseTable
        }
      }
    });

    const csvBtn = wrapper.find(`#${elementIds.BTN_EXPORT_SCHEDULE_CSV}`);
    expect(csvBtn.exists()).toBe(true);
    await csvBtn.trigger('click');
    expect(csvSpy).toHaveBeenCalledWith('mortgage_schedule', mockHeaders, mockRows, mockTotals);

    const jsonBtn = wrapper.find(`#${elementIds.BTN_EXPORT_SCHEDULE_JSON}`);
    expect(jsonBtn.exists()).toBe(true);
    await jsonBtn.trigger('click');
    expect(jsonSpy).toHaveBeenCalled();
  });
});
