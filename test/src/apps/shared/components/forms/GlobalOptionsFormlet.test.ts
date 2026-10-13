import { createPinia, setActivePinia } from 'pinia';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it } from 'vitest';
import GlobalOptionsFormlet from '@/apps/shared/components/forms/GlobalOptionsFormlet.vue';
import { useGlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';
import htmlid from '@/apps/shared/constants/elementIds';

describe('GlobalOptionsFormlet Component', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  const globalConfig = {
    components: {
      BaseButton,
    },
  };

  it('renders theme and periodsAsDates toggles and calls store methods on click', async () => {
    const store = useGlobalOptionsStore();
    const wrapper = mount(GlobalOptionsFormlet, { global: globalConfig });

    expect(wrapper.text()).toContain('Theme Appearance');
    expect(wrapper.text()).toContain('Periods as Dates');

    const buttons = wrapper.findAllComponents(BaseButton);
    const initialDarkMode = store.darkMode;
    await buttons[0].trigger('click');
    expect(store.darkMode).toBe(!initialDarkMode);

    const initialDates = store.periodsAsDates;
    await buttons[1].trigger('click');
    expect(store.periodsAsDates).toBe(!initialDates);
  });

  it('renders currency and language selects and updates currency on change', async () => {
    const store = useGlobalOptionsStore();
    const wrapper = mount(GlobalOptionsFormlet, { global: globalConfig });

    const currencySelect = wrapper.find<HTMLSelectElement>(`#${htmlid.GLOBAL_OPTIONS_ID}-currency`);
    expect(currencySelect.exists()).toBe(true);
    await currencySelect.setValue('EUR');
    expect(store.currency).toBe('EUR');

    const languageSelect = wrapper.find<HTMLSelectElement>(`#${htmlid.GLOBAL_OPTIONS_ID}-language`);
    expect(languageSelect.exists()).toBe(true);
    await languageSelect.setValue('de-DE');
    expect(store.language).toBe('de-DE');
  });

  it('exposes collapseAll and expandAll methods without error', () => {
    const wrapper = mount(GlobalOptionsFormlet, { global: globalConfig });
    expect(() => wrapper.vm.collapseAll()).not.toThrow();
    expect(() => wrapper.vm.expandAll()).not.toThrow();
  });
});
