import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import BaseTabs from '@/apps/shared/components/ui/BaseTabs.vue';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';

describe('BaseTabs Component', () => {
  const mockPivot = [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];

  const mockGetItemName = (id: string) => `Item ${id}`;

  it('renders tabs and content correctly', async () => {
    const setViewedItemId = vi.fn();
    const isViewedItemId = vi.fn((id) => id === '2');

    const wrapper = mount(BaseTabs, {
      props: {
        pivot: mockPivot as any,
        getItemName: mockGetItemName,
        isViewedItemId,
        setViewedItemId
      },
      slots: {
        tabContent: '<div class="content">Tab Content</div>'
      },
      global: {
        components: {
          BaseButton
        }
      }
    });

    // Check rendering
    const buttons = wrapper.findAll('button');
    expect(buttons.length).toBe(3);
    expect(buttons[0].text()).toBe('Item 1');
    expect(buttons[1].text()).toBe('Item 2');
    expect(buttons[2].text()).toBe('Item 3');

    // Check content slot
    expect(wrapper.find('.content').text()).toBe('Tab Content');

    // Check active class logic
    expect(isViewedItemId).toHaveBeenCalledWith('1');
    expect(isViewedItemId).toHaveBeenCalledWith('2');
    expect(isViewedItemId).toHaveBeenCalledWith('3');

    // Active tab (id: 2) should have secondary class
    expect(buttons[1].classes()).toContain('btn-secondary');
    expect(buttons[1].classes()).toContain('shadow-lg');

    // Inactive tabs should have ghost class
    expect(buttons[0].classes()).toContain('btn-ghost');
    expect(buttons[2].classes()).toContain('btn-ghost');

    // Check click interaction
    await buttons[0].trigger('click');
    expect(setViewedItemId).toHaveBeenCalledWith('1');
  });
});
