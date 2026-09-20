import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { setActivePinia } from 'pinia';
import HeaderBar from '@/apps/debtonate/components/HeaderBar.vue';
import { useDebtonateCoreStore } from '@/apps/debtonate/stores/core';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';
import BaseMenu from '@/apps/shared/components/ui/BaseMenu.vue';
import constants from '@/apps/debtonate/constants/constants';

// Mock vue-router
const pushMock = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock
  })
}));

describe('HeaderBar Component (Debtonate)', () => {
  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn });
    setActivePinia(pinia);

    const store = useDebtonateCoreStore();
    (store as any).menuButtons = [
      { text: 'Options', onClick: vi.fn(), classes: [] },
      { text: 'Load', onClick: vi.fn(), classes: [] },
      { text: 'Save', onClick: vi.fn(), classes: [] },
      { text: 'Clear', onClick: vi.fn(), classes: [] },
      { text: 'Copy', onClick: vi.fn(), classes: [] },
    ];

    pushMock.mockClear();
  });

  const globalConfig = {
    components: {
      BaseButton,
      BaseMenu
    }
  };

  it('renders correctly and shows phase buttons', () => {
    const wrapper = mount(HeaderBar, { global: globalConfig });
    const appMenu = wrapper.findComponent(BaseMenu);
    expect(appMenu.props('text')).toBe(constants.NAME_DEBTONATE);

    const buttons = wrapper.findAll('button');
    expect(buttons.length).toBe(4);
    expect(buttons[0].text()).toBe(constants.NAME_DEBTONATE);
    expect(buttons[1].text()).toBe('Current Debt');
    expect(buttons[2].text()).toBe('Refinancing');
    expect(buttons[3].text()).toBe(constants.BTN_OPTIONS);
  });

  it('toggles phase when buttons are clicked', async () => {
    const store = useDebtonateCoreStore();
    const wrapper = mount(HeaderBar, { global: globalConfig });

    const buttons = wrapper.findAll('button');

    await buttons[2].trigger('click'); // Click Refinancing
    expect(store.setPhase).toHaveBeenCalledWith(constants.PHASE_REPATRIATE);

    await buttons[1].trigger('click'); // Click Current Debt
    expect(store.setPhase).toHaveBeenCalledWith(constants.PHASE_DEBTONATE);
  });

  it('opens options modal via options button', async () => {
    const store = useDebtonateCoreStore();
    const wrapper = mount(HeaderBar, { global: globalConfig });

    const buttons = wrapper.findAll('button');
    const optionsButton = buttons.find(b => b.text() === constants.BTN_OPTIONS);

    await optionsButton?.trigger('click');
    expect(store.openOptionsForm).toHaveBeenCalled();
  });

  it('navigates to Appreciate via app menu', async () => {
    const wrapper = mount(HeaderBar, { global: globalConfig });

    const appMenu = wrapper.findAllComponents(BaseMenu)[0];
    const menuItems = appMenu.findAll('li a');
    const appreciateItem = menuItems.find(item => item.text() === constants.NAME_APPRECIATE);

    expect(appreciateItem?.exists()).toBe(true);
    await appreciateItem?.trigger('click');

    expect(pushMock).toHaveBeenCalled();
  });
});
