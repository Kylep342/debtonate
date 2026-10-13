import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setActivePinia } from 'pinia';
import BudgetForm from '@/apps/debtonate/components/forms/BudgetForm.vue';
import { useDebtonateCoreStore } from '@/apps/debtonate/stores/core';
import SharedBudgetForm from '@/apps/shared/components/forms/BudgetForm.vue';
import constants from '@/apps/debtonate/constants/constants';

describe('BudgetForm Component (Debtonate)', () => {
  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn });
    setActivePinia(pinia);
  });

  it('renders SharedBudgetForm and creates a budget', () => {
    const store = useDebtonateCoreStore();
    (store as any).budgetFormTitle = 'Creating a Budget';
    (store as any).budgetFormActive = true;
    (store as any).totalMinPayment = 450;
    (store as any).currentBudgetId = null;

    const wrapper = mount(BudgetForm, {
      global: {
        stubs: {
          SharedBudgetForm: true,
        },
      },
    });

    const form = wrapper.findComponent(SharedBudgetForm);
    expect(form.exists()).toBe(true);
    expect(form.props('title')).toBe('Creating a Budget');
    expect(form.props('minimumAmount')).toBe(450);
    expect(form.props('saveButtonText')).toBe(constants.BTN_CREATE);

    // Call submit
    form.props('onSubmit')(250);
    expect(store.createBudget).toHaveBeenCalledWith(250);
  });

  it('renders initialAmount and Save button when editing existing budget', () => {
    const store = useDebtonateCoreStore();
    (store as any).budgetFormTitle = 'Editing Budget 1';
    (store as any).budgetFormActive = true;
    (store as any).currentBudgetId = 'b1';
    vi.mocked(store.getBudget).mockReturnValue({ id: 'b1', relative: 350, absolute: 800 } as any);

    const wrapper = mount(BudgetForm, {
      global: {
        stubs: {
          SharedBudgetForm: true,
        },
      },
    });

    const form = wrapper.findComponent(SharedBudgetForm);
    expect(form.props('initialAmount')).toBe(350);
    expect(form.props('saveButtonText')).toBe(constants.BTN_SAVE);
  });
});
