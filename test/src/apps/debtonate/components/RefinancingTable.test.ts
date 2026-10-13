import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setActivePinia } from 'pinia';
import RefinancingTable from '@/apps/debtonate/components/RefinancingTable.vue';
import { useDebtonateCoreStore } from '@/apps/debtonate/stores/core';
import BaseTable from '@/apps/shared/components/ui/BaseTable.vue';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';
import constants from '@/apps/debtonate/constants/constants';

describe('RefinancingTable Component (Debtonate)', () => {
  const mockParentLoan = {
    id: 'loan-1',
    name: 'Mortgage',
    annualRate: 0.065,
    termInYears: 30,
    minPayment: 1200,
    fees: 500,
  };

  const mockScenario = {
    id: 'scen-1',
    name: '15-Year Refi',
    annualRate: 0.05,
    termInYears: 15,
    fees: 1000,
  };

  const mockSchedules = {
    'scen-1': {
      paymentAmount: 1400,
      paymentSchedule: {
        'scen-1': {
          lifetimeInterest: 40000n,
          amortizationSchedule: new Array(180).fill({}),
        },
      },
    },
  };

  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn });
    setActivePinia(pinia);
  });

  const globalConfig = {
    components: {
      BaseTable,
      BaseButton,
    },
  };

  it('renders parent loan and refinancing scenario rows correctly', () => {
    const store = useDebtonateCoreStore();
    vi.mocked(store.getLoan).mockReturnValue(mockParentLoan as any);
    vi.mocked(store.getLoanName).mockReturnValue('Mortgage');
    vi.mocked(store.getLifetimeInterest).mockReturnValue(80000);
    vi.mocked(store.getNumPayments).mockReturnValue(360);

    const wrapper = mount(RefinancingTable, {
      props: {
        parentId: 'loan-1',
        scenarios: [mockScenario as any],
        schedules: mockSchedules as any,
      },
      global: globalConfig,
    });

    expect(wrapper.text()).toContain('Refinancing Scenarios - Mortgage');
    expect(wrapper.text()).toContain('Mortgage');
    expect(wrapper.text()).toContain('15-Year Refi');

    const rows = wrapper.findAll('tbody tr');
    expect(rows.length).toBe(2);

    // Parent row has no delete button
    expect(rows[0].findComponent(BaseButton).exists()).toBe(false);

    // Scenario row has delete button
    const deleteBtn = rows[1].findComponent(BaseButton);
    expect(deleteBtn.exists()).toBe(true);
    expect(deleteBtn.text()).toContain(constants.BTN_DELETE);
  });

  it('triggers deleteRefinancingScenario when delete button is clicked', async () => {
    const store = useDebtonateCoreStore();
    vi.mocked(store.getLoan).mockReturnValue(mockParentLoan as any);
    vi.mocked(store.getLoanName).mockReturnValue('Mortgage');
    vi.mocked(store.getLifetimeInterest).mockReturnValue(80000);
    vi.mocked(store.getNumPayments).mockReturnValue(360);

    const wrapper = mount(RefinancingTable, {
      props: {
        parentId: 'loan-1',
        scenarios: [mockScenario as any],
        schedules: mockSchedules as any,
      },
      global: globalConfig,
    });

    const rows = wrapper.findAll('tbody tr');
    const deleteBtn = rows[1].findComponent(BaseButton);
    await deleteBtn.trigger('click');

    expect(store.deleteRefinancingScenario).toHaveBeenCalledWith('loan-1', 'scen-1');
  });
});
