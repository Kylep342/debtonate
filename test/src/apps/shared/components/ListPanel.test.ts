import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import ListPanel from '@/apps/shared/components/ListPanel.vue';
import BaseCard from '@/apps/shared/components/ui/BaseCard.vue';
import ManagementPanel from '@/apps/shared/components/ManagementPanel.vue';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';
import BaseMenu from '@/apps/shared/components/ui/BaseMenu.vue';

describe('ListPanel Component', () => {
  const mockItems = [{ id: '1' }, { id: '2' }];
  const mockPivotMenu = {
    text: 'Pivot',
    buttons: [],
    classes: [] // Provided classes prop
  };

  const globalConfig = {
    components: {
      BaseCard,
      ManagementPanel,
      BaseButton,
      BaseMenu
    }
  };

  it('renders correctly with items and slots', () => {
    const createItem = vi.fn();
    const wrapper = mount(ListPanel, {
      props: {
        panelId: 'test-panel',
        title: 'My Panel',
        items: mockItems,
        createItem,
        pivotMenu: mockPivotMenu,
        createText: 'Create New'
      },
      slots: {
        item: '<template #item="{ item }"><div class="item">{{ item.id }}</div></template>'
      },
      global: globalConfig
    });

    expect(wrapper.find('h2').text()).toBe('My Panel');

    // Check buttons
    const buttons = wrapper.findAll('button');
    expect(buttons[0].text()).toBe('Pivot');
    expect(buttons[1].text()).toBe('Create New');

    // Check items slot
    const renderedItems = wrapper.findAll('.item');
    expect(renderedItems.length).toBe(2);
    expect(renderedItems[0].text()).toBe('1');
    expect(renderedItems[1].text()).toBe('2');
  });

  it('calls createItem when create button is clicked', async () => {
    const createItem = vi.fn();
    const wrapper = mount(ListPanel, {
      props: {
        panelId: 'test-panel',
        title: 'My Panel',
        items: mockItems,
        createItem,
        pivotMenu: mockPivotMenu,
        createText: 'Create New'
      },
      global: globalConfig
    });

    await wrapper.find('button.btn-success').trigger('click');
    expect(createItem).toHaveBeenCalledTimes(1);
  });
});
