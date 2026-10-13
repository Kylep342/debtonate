import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setActivePinia } from 'pinia';
import RefinancingForm from '@/apps/debtonate/components/forms/RefinancingForm.vue';
import { useDebtonateCoreStore } from '@/apps/debtonate/stores/core';
import BaseModal from '@/apps/shared/components/ui/BaseModal.vue';
import BaseCard from '@/apps/shared/components/ui/BaseCard.vue';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';
import constants from '@/apps/debtonate/constants/constants';

describe('RefinancingForm Component (Debtonate)', () => {
  const mockParentLoan = {
    id: 'loan-1',
    name: 'Car Loan',
    principal: 20000,
    currentBalance: 15000,
    annualRate: 0.06,
    termInYears: 5,
    minPayment: 386.66,
    fees: 0,
  };

  beforeEach(() => {
    if (!HTMLDialogElement.prototype.showModal) {
      HTMLDialogElement.prototype.showModal = vi.fn();
    }
    if (!HTMLDialogElement.prototype.close) {
      HTMLDialogElement.prototype.close = vi.fn();
    }
    const pinia = createTestingPinia({ createSpy: vi.fn });
    setActivePinia(pinia);
  });

  const globalConfig = {
    components: {
      BaseModal,
      BaseCard,
      BaseButton,
    },
  };

  it('renders with parent loan info when modal is active', async () => {
    const store = useDebtonateCoreStore();
    (store as any).currentLoanId = 'loan-1';
    (store as any).refinancingFormActive = true;
    (store as any).refinancingFormTitle = 'Refinancing Car Loan';
    vi.mocked(store.getLoan).mockReturnValue(mockParentLoan as any);
    vi.mocked(store.getLoanName).mockReturnValue('Car Loan');

    const wrapper = mount(RefinancingForm, { global: globalConfig });

    expect(wrapper.text()).toContain('Refinancing Car Loan');
    expect(wrapper.text()).toContain('Car Loan:');
    expect(wrapper.text()).toContain('6.00% APR');
    expect(wrapper.text()).toContain('5 yrs');
  });

  it('enables refinance button and calculates estimated payment when inputs are valid', async () => {
    const store = useDebtonateCoreStore();
    (store as any).currentLoanId = 'loan-1';
    (store as any).refinancingFormActive = true;
    (store as any).refinancingFormTitle = 'Refinancing Car Loan';
    vi.mocked(store.getLoan).mockReturnValue(mockParentLoan as any);
    vi.mocked(store.getLoanName).mockReturnValue('Car Loan');

    const wrapper = mount(RefinancingForm, { global: globalConfig });

    const balanceInput = wrapper.find<HTMLInputElement>(`#${constants.REFINANCING_FORM_ID}-current-balance`);
    const rateInput = wrapper.find<HTMLInputElement>(`#${constants.REFINANCING_FORM_ID}-interest-rate`);
    const termInput = wrapper.find<HTMLInputElement>(`#${constants.REFINANCING_FORM_ID}-term-in-years`);
    const feesInput = wrapper.find<HTMLInputElement>(`#${constants.REFINANCING_FORM_ID}-fees`);
    const nameInput = wrapper.find<HTMLInputElement>(`#${constants.REFINANCING_FORM_ID}-name`);

    await balanceInput.setValue(10000);
    await rateInput.setValue(4.5);
    await termInput.setValue(3);
    await feesInput.setValue(150);
    await nameInput.setValue('Credit Union Refi');

    expect(wrapper.text()).toContain('Estimated New Monthly Payment:');

    // Click refinance button
    const refinanceBtn = wrapper.findAllComponents(BaseButton).find((b) => b.text().includes(constants.BTN_REFINANCE));
    expect(refinanceBtn?.exists()).toBe(true);
    expect(refinanceBtn?.attributes('disabled')).toBeUndefined();

    await refinanceBtn!.trigger('click');

    expect(store.createRefinanceScenario).toHaveBeenCalledWith(
      'loan-1',
      10000,
      0.045,
      3,
      'Credit Union Refi',
      150,
    );
    expect(store.exitRefinancingForm).toHaveBeenCalled();
  });

  it('exits and clears form on Cancel button click', async () => {
    const store = useDebtonateCoreStore();
    (store as any).currentLoanId = 'loan-1';
    (store as any).refinancingFormActive = true;
    (store as any).refinancingFormTitle = 'Refinancing Car Loan';
    vi.mocked(store.getLoan).mockReturnValue(mockParentLoan as any);
    vi.mocked(store.getLoanName).mockReturnValue('Car Loan');

    const wrapper = mount(RefinancingForm, { global: globalConfig });

    const cancelBtn = wrapper.findAllComponents(BaseButton).find((b) => b.text().includes('Cancel'));
    expect(cancelBtn?.exists()).toBe(true);

    await cancelBtn!.trigger('click');
    expect(store.exitRefinancingForm).toHaveBeenCalled();
  });
});
