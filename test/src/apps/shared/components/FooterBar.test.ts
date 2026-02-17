import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import FooterBar from '@/apps/shared/components/FooterBar.vue';

describe('FooterBar Component', () => {
  it('renders correctly with links', () => {
    const wrapper = mount(FooterBar);

    const links = wrapper.findAll('a');
    expect(links.length).toBe(2);
    expect(links[0].text()).toBe('source');
    expect(links[0].attributes('href')).toContain('github.com');
    expect(links[1].text()).toBe('report a bug');
    expect(links[1].attributes('href')).toContain('forms.gle');
  });
});
