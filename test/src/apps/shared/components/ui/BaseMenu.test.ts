import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import BaseMenu from '@/apps/shared/components/ui/BaseMenu.vue';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';

describe('BaseMenu Component', () => {
  it('renders correctly with buttons', async () => {
    const onClickSpy = vi.fn();
    const mockButtons = [
      { text: 'Action 1', onClick: onClickSpy },
      { text: 'Action 2', onClick: () => {} }
    ];

    const wrapper = mount(BaseMenu, {
      props: {
        text: 'Menu Text',
        buttons: mockButtons,
        classes: ['custom-menu-class']
      },
      global: {
        components: {
          BaseButton
        }
      }
    });

    expect(wrapper.find('button').text()).toBe('Menu Text');
    expect(wrapper.find('button').classes()).toContain('custom-menu-class');

    const menuItems = wrapper.findAll('li');
    expect(menuItems.length).toBe(2);
    expect(menuItems[0].text()).toBe('Action 1');
    expect(menuItems[1].text()).toBe('Action 2');

    await menuItems[0].trigger('click');
    expect(onClickSpy).toHaveBeenCalledTimes(1);
  });
});
