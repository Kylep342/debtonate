import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import BaseCard from '@/apps/shared/components/ui/BaseCard.vue';

describe('BaseCard Component', () => {
  it('renders all slots correctly', () => {
    const wrapper = mount(BaseCard, {
      slots: {
        cardTitle: '<h2 class="title">My Title</h2>',
        cardBody: '<p class="content">My Content</p>',
        cardActions: '<button class="action">Action</button>'
      }
    });

    expect(wrapper.find('.title').text()).toBe('My Title');
    expect(wrapper.find('.content').text()).toBe('My Content');
    expect(wrapper.find('.action').text()).toBe('Action');
  });

  it('applies base card classes', () => {
    const wrapper = mount(BaseCard);
    expect(wrapper.classes()).toContain('card');
    expect(wrapper.find('.card-body').exists()).toBe(true);
    expect(wrapper.find('.card-body').classes()).toContain('p-4');
  });

  it('applies custom body classes via prop', () => {
    const wrapper = mount(BaseCard, {
      props: {
        bodyClasses: ['custom-body-class']
      }
    });

    expect(wrapper.find('.card-body').classes()).toContain('custom-body-class');
    expect(wrapper.find('.card-body').classes()).toContain('p-4');
  });

  it('omits default p-4 and md:px-6 padding when custom padding classes are provided in bodyClasses', () => {
    const wrapper = mount(BaseCard, {
      props: {
        bodyClasses: ['p-3', 'pt-2.5']
      }
    });

    const classes = wrapper.find('.card-body').classes();
    expect(classes).toContain('p-3');
    expect(classes).toContain('pt-2.5');
    expect(classes).not.toContain('p-4');
    expect(classes).not.toContain('md:px-6');
  });
});
