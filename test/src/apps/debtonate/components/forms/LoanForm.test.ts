import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { setActivePinia } from 'pinia';

import LoanForm from '@/apps/debtonate/components/forms/LoanForm.vue';
import { useDebtonateCoreStore } from '@/apps/debtonate/stores/core';
import BaseEntityForm from '@/apps/shared/components/forms/BaseEntityForm.vue';

describe('LoanForm Component (Debtonate)', () => {
  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn });
    setActivePinia(pinia);
  });

  it('renders BaseEntityForm with loan fields', () => {
    const store = useDebtonateCoreStore();
    (store as any).loanFormTitle = 'Create Loan';
    (store as any).loanFormActive = true;
    (store as any).currentLoanId = null;

    const wrapper = mount(LoanForm, {
      global: {
        stubs: {
          BaseEntityForm: true
        }
      }
    });

    const form = wrapper.findComponent(BaseEntityForm);
    expect(form.exists()).toBe(true);
    expect(form.props('title')).toBe('Create Loan');
  });

  it('submits loan form with converted interest rate', async () => {
    const store = useDebtonateCoreStore();
    (store as any).loanFormTitle = 'Create Loan';
    (store as any).loanFormActive = true;
    (store as any).currentLoanId = null;

    const wrapper = mount(LoanForm, {
      global: {
        components: {
          BaseEntityForm
        }
      }
    });

    const baseForm = wrapper.findComponent(BaseEntityForm);
    baseForm.props('onSubmit')({
      principal: 10000,
      interestRate: 5.5,
      termInYears: 3,
      name: 'Car Loan',
      currentBalance: 9000,
      fees: 100
    });

    expect(store.createLoan).toHaveBeenCalledWith(
      10000,
      0.055,
      3,
      'Car Loan',
      9000,
      100
    );
  });
});
