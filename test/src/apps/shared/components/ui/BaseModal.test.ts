import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import BaseModal from '@/apps/shared/components/ui/BaseModal.vue';
import BaseCard from '@/apps/shared/components/ui/BaseCard.vue';

describe('BaseModal Component', () => {
  beforeEach(() => {
    // We need to patch the global HTMLDialogElement prototype because JSDOM doesn't support it
    if (!HTMLDialogElement.prototype.showModal) {
      HTMLDialogElement.prototype.showModal = vi.fn();
    }
    if (!HTMLDialogElement.prototype.close) {
      HTMLDialogElement.prototype.close = vi.fn();
    }
  });

  it('renders correctly with slots', () => {
    const wrapper = mount(BaseModal, {
      props: {
        id: 'test-modal',
        bodyClasses: ['custom-modal-body']
      },
      slots: {
        header: '<h2>Modal Header</h2>',
        body: '<p>Modal Body Content</p>',
        actions: '<button>Submit</button>'
      },
      global: {
        components: {
          BaseCard
        }
      }
    });

    expect(wrapper.find('dialog').attributes('id')).toBe('test-modal');
    expect(wrapper.find('header').text()).toBe('Modal Header');
    expect(wrapper.find('.custom-modal-body').exists()).toBe(true);
    expect(wrapper.find('p').text()).toBe('Modal Body Content');
    expect(wrapper.find('button').text()).toBe('Submit');
  });

  it('applies custom boxClasses to modal-box', () => {
    const wrapper = mount(BaseModal, {
      props: {
        id: 'test-modal',
        boxClasses: ['modal-details-box', 'custom-box-class'],
      },
      global: {
        components: {
          BaseCard,
        },
      },
    });

    const modalBox = wrapper.find('.modal-box');
    expect(modalBox.exists()).toBe(true);
    expect(modalBox.classes()).toContain('modal-details-box');
    expect(modalBox.classes()).toContain('custom-box-class');
  });

  it('resizes individually by default (compositeSize="auto") and applies composite classes when specified', () => {
    const defaultWrapper = mount(BaseModal, {
      props: { id: 'auto-modal' },
      global: { components: { BaseCard } },
    });
    const defaultBox = defaultWrapper.find('.modal-box');
    expect(defaultBox.classes()).not.toContain('modal-composite-details');
    expect(defaultBox.classes()).not.toContain('modal-composite-share');

    const detailsWrapper = mount(BaseModal, {
      props: { id: 'details-modal', compositeSize: 'details' },
      global: { components: { BaseCard } },
    });
    expect(detailsWrapper.find('.modal-box').classes()).toContain('modal-composite-details');

    const shareWrapper = mount(BaseModal, {
      props: { id: 'share-modal', compositeSize: 'share' },
      global: { components: { BaseCard } },
    });
    expect(shareWrapper.find('.modal-box').classes()).toContain('modal-composite-share');
  });

  it('emits exit when the dialog is closed', async () => {
    const wrapper = mount(BaseModal, {
      props: {
        id: 'test-modal'
      },
      global: {
        components: {
          BaseCard
        }
      }
    });

    // Simulate closing the dialog
    await wrapper.find('dialog').trigger('close');

    expect(wrapper.emitted('exit')).toBeTruthy();
    expect(wrapper.emitted('exit')?.length).toBe(1);
  });
});
