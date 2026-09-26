import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';

import GlossaryModal from '@/apps/shared/components/GlossaryModal.vue';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';
import BaseCard from '@/apps/shared/components/ui/BaseCard.vue';
import BaseMenu from '@/apps/shared/components/ui/BaseMenu.vue';
import BaseModal from '@/apps/shared/components/ui/BaseModal.vue';
import elementIds from '@/apps/shared/constants/elementIds';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';

describe('GlossaryModal Component', () => {
  let globalOptions: GlobalOptionsStore;

  const globalConfig = {
    components: {
      BaseModal,
      BaseCard,
      BaseButton,
      BaseMenu,
    },
  };

  beforeEach(() => {
    setActivePinia(createPinia());
    globalOptions = useGlobalOptionsStore();
    globalOptions.openGlossary();
  });

  it('renders glossary modal with title and search bar', () => {
    const wrapper = mount(GlossaryModal, {
      props: { id: 'glossaryModal' },
      global: globalConfig,
    });

    expect(wrapper.text()).toContain('Financial Glossary & Guide');
    expect(wrapper.find(`#${elementIds.INPUT_GLOSSARY_SEARCH}`).exists()).toBe(true);
    expect(wrapper.text()).toContain('Principal');
    expect(wrapper.text()).toContain('Snowball Method');
  });

  it('filters entries when search input changes', async () => {
    const wrapper = mount(GlossaryModal, {
      props: { id: 'glossaryModal' },
      global: globalConfig,
    });

    const input = wrapper.find(`#${elementIds.INPUT_GLOSSARY_SEARCH}`);
    await input.setValue('Avalanche');

    expect(wrapper.text()).toContain('Avalanche Method');
    expect(wrapper.text()).not.toContain('Snowball Method');
  });

  it('filters entries by category dropdown', async () => {
    const wrapper = mount(GlossaryModal, {
      props: { id: 'glossaryModal' },
      global: globalConfig,
    });

    const menu = wrapper.findComponent(BaseMenu);
    expect(menu.props('text')).toBe('All Terms');

    // Find and click Investing menu item
    const menuItems = wrapper.findAll('li');
    const investingItem = menuItems.find((li) => li.text().includes('Investing'));
    expect(investingItem?.exists()).toBe(true);

    await investingItem?.trigger('click');
    expect(menu.props('text')).toBe('Appreciate (Investing)');
    expect(wrapper.text()).toContain('Annual Contribution Limit');
    expect(wrapper.text()).not.toContain('Snowball Method');
  });

  it('shows empty state when no results match', async () => {
    const wrapper = mount(GlossaryModal, {
      props: { id: 'glossaryModal' },
      global: globalConfig,
    });

    const input = wrapper.find(`#${elementIds.INPUT_GLOSSARY_SEARCH}`);
    await input.setValue('supercalifragilistic');

    expect(wrapper.text()).toContain('No terms found matching "supercalifragilistic"');
  });

  it('closes glossary when Done button is clicked', async () => {
    const wrapper = mount(GlossaryModal, {
      props: { id: 'glossaryModal' },
      global: globalConfig,
    });

    expect(globalOptions.isGlossaryActive).toBe(true);

    const doneButton = wrapper.find(`#${elementIds.BTN_GLOSSARY_DONE}`);
    expect(doneButton.exists()).toBe(true);

    await doneButton.trigger('click');
    expect(globalOptions.isGlossaryActive).toBe(false);
  });

  it('closes glossary when header close button is clicked', async () => {
    const wrapper = mount(GlossaryModal, {
      props: { id: 'glossaryModal' },
      global: globalConfig,
    });

    expect(globalOptions.isGlossaryActive).toBe(true);

    const closeButton = wrapper.find(`#${elementIds.BTN_GLOSSARY_CLOSE}`);
    expect(closeButton.exists()).toBe(true);

    await closeButton.trigger('click');
    expect(globalOptions.isGlossaryActive).toBe(false);
  });
});
