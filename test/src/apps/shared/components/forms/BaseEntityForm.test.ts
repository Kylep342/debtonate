import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import BaseEntityForm from '@/apps/shared/components/forms/BaseEntityForm.vue';
import BaseModal from '@/apps/shared/components/ui/BaseModal.vue';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';
import BaseCard from '@/apps/shared/components/ui/BaseCard.vue';
import { FormField } from '@/apps/shared/types/app';

describe('BaseEntityForm Component', () => {
  const mockFields: FormField[] = [
    { key: 'f1', label: 'Field 1', type: 'number', required: true },
    { key: 'f2', label: 'Field 2', type: 'text', required: false },
  ];

  const defaultProps = {
    modalId: 'test-modal',
    title: 'Test Form',
    fields: mockFields,
    initialValues: { f1: null, f2: '' },
    saveButtonText: 'Save',
    isActive: true,
    onExit: vi.fn(),
    onSubmit: vi.fn(),
  };

  const globalConfig = {
    components: {
      BaseModal,
      BaseButton,
      BaseCard
    }
  };

  it('renders correctly with fields', () => {
    const wrapper = mount(BaseEntityForm, {
      props: defaultProps,
      global: globalConfig
    });

    expect(wrapper.find('h2').text()).toBe('Test Form');
    expect(wrapper.findAll('input').length).toBe(2);
    expect(wrapper.find('input[type="number"]').exists()).toBe(true);
    expect(wrapper.find('input[type="text"]').exists()).toBe(true);
  });

  it('populates initial values', () => {
    const wrapper = mount(BaseEntityForm, {
      props: {
        ...defaultProps,
        initialValues: { f1: 123, f2: 'hello' }
      },
      global: globalConfig
    });

    const inputs = wrapper.findAll('input');
    expect((inputs[0].element as HTMLInputElement).value).toBe('123');
    expect((inputs[1].element as HTMLInputElement).value).toBe('hello');
  });

  it('disables submit button when required fields are missing', () => {
    const wrapper = mount(BaseEntityForm, {
      props: defaultProps,
      global: globalConfig
    });

    const submitBtn = wrapper.find('button.btn-success');
    expect(submitBtn.attributes('disabled')).toBeDefined();
  });

  it('enables submit button when required fields are valid', async () => {
    const wrapper = mount(BaseEntityForm, {
      props: defaultProps,
      global: globalConfig
    });

    await wrapper.find('input[type="number"]').setValue(100);

    const submitBtn = wrapper.find('button.btn-success');
    expect(submitBtn.attributes('disabled')).toBeUndefined();
  });

  it('calls onSubmit with form data when clicked', async () => {
    const onSubmit = vi.fn();
    const wrapper = mount(BaseEntityForm, {
      props: {
        ...defaultProps,
        onSubmit
      },
      global: globalConfig
    });

    await wrapper.find('input[type="number"]').setValue(100);
    await wrapper.find('input[type="text"]').setValue('optional text');
    await wrapper.find('button.btn-success').trigger('click');

    expect(onSubmit).toHaveBeenCalledWith({ f1: 100, f2: 'optional text' });
  });

  it('calls onExit when exit button is clicked', async () => {
    const onExit = vi.fn();
    const wrapper = mount(BaseEntityForm, {
      props: {
        ...defaultProps,
        onExit
      },
      global: globalConfig
    });

    await wrapper.find('button.btn-ghost').trigger('click');
    expect(onExit).toHaveBeenCalledTimes(1);
  });
});
