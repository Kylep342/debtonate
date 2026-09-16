import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';

import FooterBar from '@/apps/shared/components/FooterBar.vue';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';

describe('FooterBar Component', () => {
  let globalOptions: GlobalOptionsStore;

  beforeEach(() => {
    setActivePinia(createPinia());
    globalOptions = useGlobalOptionsStore();
  });

  it('renders correctly with links and glossary button', async () => {
    const wrapper = mount(FooterBar);

    const links = wrapper.findAll('a');
    expect(links.length).toBe(2);
    expect(links[0].text()).toBe('source');
    expect(links[0].attributes('href')).toContain('github.com');
    expect(links[1].text()).toBe('report a bug');
    expect(links[1].attributes('href')).toContain('forms.gle');

    const buttons = wrapper.findAll('button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].text()).toBe('glossary');
    expect(buttons[1].text()).toBe('share & export');

    expect(globalOptions.isGlossaryActive).toBe(false);
    await buttons[0].trigger('click');
    expect(globalOptions.isGlossaryActive).toBe(true);

    expect(globalOptions.isShareExportActive).toBe(false);
    await buttons[1].trigger('click');
    expect(globalOptions.isShareExportActive).toBe(true);
  });
});
