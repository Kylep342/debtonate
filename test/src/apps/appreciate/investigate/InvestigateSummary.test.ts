import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { setActivePinia } from 'pinia';

import InvestigateSummary from '@/apps/appreciate/investigate/components/InvestigateSummary.vue';
import { useAppreciateCoreStore } from '@/apps/appreciate/stores/core';
import { useGlobalOptionsStore } from '@/apps/shared/stores/globalOptions';

describe('InvestigateSummary Component (Appreciate)', () => {
  beforeEach(() => {
    const pinia = createTestingPinia({ createSpy: vi.fn });
    setActivePinia(pinia);
  });

  it('renders retirement comparison table with crossover point and initial withdrawal rate rows', () => {
    const store = useAppreciateCoreStore();
    const globalOptions = useGlobalOptionsStore();

    store.yearsToSpend = 30;
    (store as any).monthlyBudgets = [
      { id: 'default', relative: 0, absolute: 0 },
      { id: 'b1', relative: 1000, absolute: 1000 },
    ];

    vi.mocked(store.getBudgetName).mockImplementation((id: string) => {
      return id === 'default' ? 'Minimum Budget' : 'Budget 1';
    });

    vi.mocked(store.getContributionSchedule).mockImplementation((_instId: string, budgetId: string) => {
      const balance = budgetId === 'default' ? 200000 : 1000000;
      return {
        lifetimeGrowth: 50000,
        lifetimeContribution: budgetId === 'default' ? 0 : 500000,
        amortizationSchedule: [{ currentBalance: balance }],
      } as any;
    });

    vi.mocked(store.getCrossoverPoint).mockImplementation((_instId: string, budgetId: string) => {
      if (budgetId === 'default') {
        return { period: null, formatted: 'N/A', reached: false };
      }
      return { period: 130, formatted: 'Period 130', reached: true };
    });

    vi.mocked(store.getSafeWithdrawalRateForCareerBudget).mockImplementation((budgetId: string) => {
      if (budgetId === 'default') {
        return {
          rate: 12,
          formatted: '12.00%',
          tier: 'danger',
          label: 'High Risk',
          badgeClass: 'badge-error',
        };
      }
      return {
        rate: 3.8,
        formatted: '3.80%',
        tier: 'benchmark',
        label: '4% Rule',
        badgeClass: 'badge-info',
      };
    });

    (store as any).careerRetirementComparison = {
      default: {
        totals: {
          lifetimeGrowth: 50000,
          lifetimeWithdrawal: 100000,
          amortizationSchedule: [{ currentBalance: 0, period: 120 }],
        },
      },
      b1: {
        totals: {
          lifetimeGrowth: 800000,
          lifetimeWithdrawal: 400000,
          amortizationSchedule: [{ currentBalance: 1200000, period: 360 }],
        },
      },
    };

    vi.mocked(globalOptions.Money).mockImplementation((val: any) => `$${val}`);

    const wrapper = mount(InvestigateSummary);

    expect(wrapper.text()).toContain('Retirement Comparison (by Career Budget)');
    expect(wrapper.text()).toContain('Initial Retirement Balance');
    expect(wrapper.text()).toContain('Crossover Point');
    expect(wrapper.text()).toContain('Period 130');
    expect(wrapper.text()).toContain('N/A');
    expect(wrapper.text()).toContain('Initial Withdrawal Rate (SWR)');
    expect(wrapper.text()).toContain('3.80% (4% Rule)');
    expect(wrapper.text()).toContain('12.00% (High Risk)');
  });
});
