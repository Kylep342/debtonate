import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import SharedBudgetForm from '@/apps/shared/components/forms/BudgetForm.vue';
import BaseModal from '@/apps/shared/components/ui/BaseModal.vue';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';
import BaseCard from '@/apps/shared/components/ui/BaseCard.vue';

describe('Shared BudgetForm Component', () => {
  const defaultProps = {
    modalId: 'budgetModal',
    title: 'Edit Budget',
    label: 'Budget Amount',
    initialAmount: 500,
    saveButtonText: 'Save',
    isActive: true,
    onExit: vi.fn(),
    onSubmit: vi.fn()
  };

  const globalConfig = {
    components: {
      BaseModal,
      BaseButton,
      BaseCard
    }
  };

  it('renders correctly with title and initial amount', () => {
    const wrapper = mount(SharedBudgetForm, {
      props: defaultProps,
      global: globalConfig
    });

    expect(wrapper.find('h2').text()).toBe('Edit Budget');
    expect(wrapper.find('input[type="number"]').exists()).toBe(true);
    expect((wrapper.find('input[type="number"]').element as HTMLInputElement).value).toBe('500');
  });

  it('disables submit when amount is 0 or negative', async () => {
    const wrapper = mount(SharedBudgetForm, {
      props: {
        ...defaultProps,
        initialAmount: 0
      },
      global: globalConfig
    });

    const submitBtn = wrapper.find('button.btn-success');
    expect(submitBtn.attributes('disabled')).toBeDefined();
  });

  it('calls onSubmit with amount when clicked', async () => {
    const onSubmit = vi.fn();
    const wrapper = mount(SharedBudgetForm, {
      props: {
        ...defaultProps,
        onSubmit
      },
      global: globalConfig
    });

    await wrapper.find('input[type="number"]').setValue(1200);
    await wrapper.find('button.btn-success').trigger('click');

    expect(onSubmit).toHaveBeenCalledWith(1200);
  });

  it('renders global minimum banner, in-addition notice, and dynamic breakdown when minimumAmount is provided', async () => {
    const wrapper = mount(SharedBudgetForm, {
      props: {
        ...defaultProps,
        minimumAmount: 1250,
        initialAmount: 250
      },
      global: globalConfig
    });

    expect(wrapper.text()).toContain('Current Global Minimum');
    expect(wrapper.text()).toContain('in addition');
    expect(wrapper.text()).toContain('Baseline Minimum:');
    expect(wrapper.text()).toContain('Extra (In Addition):');
    expect(wrapper.text()).toContain('Total Monthly Payment:');
  });

  it('omits global minimum banner when minimumAmount is undefined (Appreciate behavior)', async () => {
    const wrapper = mount(SharedBudgetForm, {
      props: {
        ...defaultProps,
        minimumAmount: undefined
      },
      global: globalConfig
    });

    expect(wrapper.text()).not.toContain('Current Global Minimum');
    expect(wrapper.text()).not.toContain('in addition');
    expect(wrapper.text()).toContain('This amount will be allocated toward your plan each monthly period.');
  });
});
