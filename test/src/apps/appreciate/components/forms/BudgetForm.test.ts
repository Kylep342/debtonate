import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setActivePinia } from 'pinia';
import BudgetForm from '@/apps/appreciate/components/forms/BudgetForm.vue';
import { useAppreciateCoreStore } from '@/apps/appreciate/stores/core';
import SharedBudgetForm from '@/apps/shared/components/forms/BudgetForm.vue';
import constants from '@/apps/appreciate/constants/constants';

describe('BudgetForm Component (Appreciate)', () => {
  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn });
    setActivePinia(pinia);
  });

  it('renders Career phase budget form and submits correctly', () => {
    const store = useAppreciateCoreStore();
    store.viewPhase = constants.PHASE_CAREER as any;
    (store as any).budgetFormTitle = 'Creating a Budget';
    (store as any).budgetFormActive = true;
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
    expect(form.props('label')).toBe(constants.BUDGET);
    expect(form.props('saveButtonText')).toBe(constants.BTN_CREATE);

    // Call submit in career phase
    form.props('onSubmit')(500);
    expect(store.createBudget).toHaveBeenCalledWith(500);
  });

  it('renders Retirement phase withdrawal form with desired net income target and submits correctly', () => {
    const store = useAppreciateCoreStore();
    store.viewPhase = constants.PHASE_RETIREMENT as any;
    (store as any).desiredNetIncome = 4000;
    (store as any).budgetFormActive = true;
    (store as any).currentBudgetId = 'w1';
    vi.mocked(store.getWithdrawalBudgetName).mockReturnValue('Scenario 1');
    vi.mocked(store.getWithdrawalBudget).mockReturnValue({ id: 'w1', relative: 4500, absolute: 4500 } as any);

    const wrapper = mount(BudgetForm, {
      global: {
        stubs: {
          SharedBudgetForm: true,
        },
      },
    });

    const form = wrapper.findComponent(SharedBudgetForm);
    expect(form.exists()).toBe(true);
    expect(form.props('title')).toBe('Editing Scenario 1');
    expect(form.props('label')).toBe('Monthly Withdrawal');
    expect(form.props('targetAmount')).toBe(4000);
    expect(form.props('initialAmount')).toBe(4500);
    expect(form.props('saveButtonText')).toBe(constants.BTN_SAVE);

    // Call submit in retirement phase
    form.props('onSubmit')(4500);
    expect(store.createWithdrawalBudget).toHaveBeenCalledWith(4500);
  });
});
