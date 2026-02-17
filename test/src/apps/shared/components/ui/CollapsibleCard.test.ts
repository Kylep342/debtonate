import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import CollapsibleCard from '@/apps/shared/components/ui/CollapsibleCard.vue';
import BaseCard from '@/apps/shared/components/ui/BaseCard.vue';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';

describe('CollapsibleCard Component', () => {
  const globalConfig = {
    components: {
      BaseCard,
      BaseButton
    }
  };

  it('toggles content visibility', async () => {
    const wrapper = mount(CollapsibleCard, {
      global: globalConfig,
      slots: {
        cardTitle: 'My Title',
        cardBody: '<p class="body">My Body</p>',
        cardActions: '<button class="action">Action</button>'
      }
    });

    // Initially expanded
    expect(wrapper.find('.body').exists()).toBe(true);
    expect(wrapper.find('.action').exists()).toBe(true);
    expect(wrapper.find('button.btn-ghost').text()).toBe('-');

    // Collapse
    await wrapper.find('button.btn-ghost').trigger('click');
    expect(wrapper.find('.body').exists()).toBe(false);
    expect(wrapper.find('.action').exists()).toBe(false);
    expect(wrapper.find('button.btn-ghost').text()).toBe('+');

    // Expand
    await wrapper.find('button.btn-ghost').trigger('click');
    expect(wrapper.find('.body').exists()).toBe(true);
    expect(wrapper.find('.action').exists()).toBe(true);
    expect(wrapper.find('button.btn-ghost').text()).toBe('-');
  });

  it('exposes collapse and expand methods', async () => {
    const wrapper = mount(CollapsibleCard, {
      global: globalConfig,
      slots: {
        cardBody: '<p class="body">Body</p>'
      }
    });

    // Initial state
    expect(wrapper.find('.body').exists()).toBe(true);

    // Call exposed collapse method
    await (wrapper.vm as any).collapse();
    expect(wrapper.find('.body').exists()).toBe(false);

    // Call exposed expand method
    await (wrapper.vm as any).expand();
    expect(wrapper.find('.body').exists()).toBe(true);
  });
});
