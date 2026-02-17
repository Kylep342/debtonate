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
      { text: constants.NAME_DEBTONATE, onClick: vi.fn(), classes: [] },
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
    expect(wrapper.find('h1').text()).toContain('Appreciate');

    const buttons = wrapper.findAll('button');
    // 2 phase buttons + 1 menu button = 3 buttons in the DOM (BaseMenu renders a button)
    expect(buttons.length).toBe(3);
    expect(buttons[0].text()).toBe('Career');
    expect(buttons[1].text()).toBe('Retirement');
  });

  it('toggles phase when buttons are clicked', async () => {
    const store = useAppreciateCoreStore();
    const wrapper = mount(HeaderBar, { global: globalConfig });

    const buttons = wrapper.findAll('button');

    await buttons[1].trigger('click'); // Click Retirement
    expect(store.setPhase).toHaveBeenCalledWith(constants.PHASE_RETIREMENT);

    await buttons[0].trigger('click'); // Click Career
    expect(store.setPhase).toHaveBeenCalledWith(constants.PHASE_CAREER);
  });

  it('navigates to Debtonate via menu', async () => {
    const wrapper = mount(HeaderBar, { global: globalConfig });

    const menuItems = wrapper.findAll('li a');
    const debtonateItem = menuItems.find(item => item.text() === constants.NAME_DEBTONATE);

    expect(debtonateItem?.exists()).toBe(true);
    await debtonateItem?.trigger('click');

    expect(pushMock).toHaveBeenCalled();
  });
});
