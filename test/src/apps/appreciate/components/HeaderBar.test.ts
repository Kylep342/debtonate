import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { setActivePinia } from 'pinia';
import HeaderBar from '@/apps/appreciate/components/HeaderBar.vue';
import { useAppreciateCoreStore } from '@/apps/appreciate/stores/core';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';
import BaseMenu from '@/apps/shared/components/ui/BaseMenu.vue';
import constants from '@/apps/appreciate/constants/constants';

// Mock vue-router
const pushMock = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: pushMock
  })
}));

describe('HeaderBar Component (Appreciate)', () => {
  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn });
    setActivePinia(pinia);

    const store = useAppreciateCoreStore();
    // Ensure menuButtons mock always includes required props for BaseMenu
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
    expect(appMenu.props('text')).toBe(constants.NAME_APPRECIATE);

    const buttons = wrapper.findAll('button');
    // 1 app menu button + 2 phase buttons + 1 options button = 4 buttons in the DOM
    expect(buttons.length).toBe(4);
    expect(buttons[0].text()).toBe(constants.NAME_APPRECIATE);
    expect(buttons[1].text()).toBe('Career');
    expect(buttons[2].text()).toBe('Retirement');
    expect(buttons[3].text()).toBe(constants.BTN_OPTIONS);
  });

  it('toggles phase when buttons are clicked', async () => {
    const store = useAppreciateCoreStore();
    const wrapper = mount(HeaderBar, { global: globalConfig });

    const buttons = wrapper.findAll('button');

    // buttons[0] is the app menu
    await buttons[2].trigger('click'); // Click Retirement
    expect(store.setPhase).toHaveBeenCalledWith(constants.PHASE_RETIREMENT);

    await buttons[1].trigger('click'); // Click Career
    expect(store.setPhase).toHaveBeenCalledWith(constants.PHASE_CAREER);
  });

  it('opens options modal via options button', async () => {
    const store = useAppreciateCoreStore();
    const wrapper = mount(HeaderBar, { global: globalConfig });

    const buttons = wrapper.findAll('button');
    const optionsButton = buttons.find(b => b.text() === constants.BTN_OPTIONS);

    await optionsButton?.trigger('click');
    expect(store.openOptionsForm).toHaveBeenCalled();
  });

  it('navigates to Debtonate via app menu', async () => {
    const wrapper = mount(HeaderBar, { global: globalConfig });

    const appMenu = wrapper.findAllComponents(BaseMenu)[0];
    const menuItems = appMenu.findAll('li a');
    const debtonateItem = menuItems.find(item => item.text() === constants.NAME_DEBTONATE);

    expect(debtonateItem?.exists()).toBe(true);
    await debtonateItem?.trigger('click');

    expect(pushMock).toHaveBeenCalled();
  });
});
