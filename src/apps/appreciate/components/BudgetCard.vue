<script setup lang="ts">
import { contributionTypes, withdrawalTypes } from 'moneyfunx';
import { computed, ComputedRef } from 'vue';

import constants from '@/apps/appreciate/constants/constants';
import { useAppreciateCoreStore, AppreciateCoreStore } from '@/apps/appreciate/stores/core';
import SummaryCard from '@/apps/shared/components/SummaryCard.vue';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { Button, CardBadge, CardMetricRow } from '@/apps/shared/types/app';
import { MonthlyBudget } from '@/apps/shared/types/core';
import { Arc } from '@/apps/shared/types/graph';

const props = defineProps<{
  budget: MonthlyBudget;
  viewedInstrumentId: string;
}>();

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
const state: AppreciateCoreStore = useAppreciateCoreStore();

const isCareerPhase: ComputedRef<boolean> = computed(() => state.viewPhase === constants.PHASE_CAREER);
const isDefault: ComputedRef<boolean> = computed(() => props.budget.id === constants.DEFAULT);

const viewedContributionSummary: ComputedRef<contributionTypes.ContributionSchedule | null> = computed(() => {
  if (!isCareerPhase.value) return null;
  return state.getContributionSchedule(props.viewedInstrumentId, props.budget.id);
});

const viewedWithdrawalSummary: ComputedRef<withdrawalTypes.WithdrawalSchedule | null> = computed(() => {
  if (isCareerPhase.value) return null;
  return state.getWithdrawalSchedule(props.viewedInstrumentId, props.budget.id);
});

const netWorth: ComputedRef<number> = computed(() => {
  if (isCareerPhase.value && viewedContributionSummary.value) {
    const schedule = viewedContributionSummary.value.amortizationSchedule;
    const finalBalance = schedule.length > 0
      ? Number(schedule.slice(-1)[0].currentBalance)
      : (state.getInstrument(props.viewedInstrumentId)?.currentBalance || (props.viewedInstrumentId === constants.TOTALS ? state.totalCurrentBalance : 0));
    return state.deflateAllMoney
      ? state.deflate(
        finalBalance,
        state.getNumContributions(constants.TOTALS, props.budget.id)
      )
      : finalBalance;
  } else if (viewedWithdrawalSummary.value) {
    const schedule = viewedWithdrawalSummary.value.amortizationSchedule;
    const finalBalance = schedule.length > 0 ? Number(schedule.slice(-1)[0].currentBalance) : 0;
    return state.deflateAllMoney
      ? state.deflate(finalBalance, state.getNumWithdrawals(constants.TOTALS, props.budget.id))
      : finalBalance;
  }
  return 0;
});

const netWorthLabel: ComputedRef<string> = computed(() => isCareerPhase.value
  ? (state.deflateAllMoney ? 'Retirement Balance (CYM)' : 'Retirement Balance')
  : (state.deflateAllMoney ? 'Ending Balance (CYM)' : 'Ending Balance')
);

const budgetAmount: ComputedRef<string> = computed(() =>
  `${globalOptions.Money(props.budget.absolute)}/month`
);

const gainsMoreThanSpends: ComputedRef<boolean> = computed(() => {
  if (isCareerPhase.value || !viewedWithdrawalSummary.value) return false;
  const summary = viewedWithdrawalSummary.value;
  return Number(summary.lifetimeGrowth) >= Number(summary.lifetimeWithdrawal);
});

const periodLabel: ComputedRef<string> = computed(() => {
  if (isCareerPhase.value) {
    return globalOptions.periodsAsDates ? 'Retire on' : 'Contributions';
  } else {
    if (gainsMoreThanSpends.value) {
      return 'Deplete on';
    }
    return globalOptions.periodsAsDates ? 'Deplete on' : 'Withdrawals';
  }
});

const budgetPeriodCount: ComputedRef<string | number | Date> = computed(() => {
  if (isCareerPhase.value && viewedContributionSummary.value) {
    return globalOptions.Period(viewedContributionSummary.value.amortizationSchedule.length, true);
  } else if (viewedWithdrawalSummary.value) {
    if (gainsMoreThanSpends.value) {
      return 'never';
    }
    const schedule = viewedWithdrawalSummary.value.amortizationSchedule;
    const depletionRecord = schedule.find(r => Number(r.currentBalance) <= 0.01);
    if (depletionRecord) {
      return globalOptions.Period(depletionRecord.period, true);
    }
    return globalOptions.Period(schedule.length, true);
  }
  return 0;
});

const steadyStateWithdrawal: ComputedRef<number> = computed(() => {
  if (!isCareerPhase.value) return 0;
  return state.getSteadyStateMonthlyWithdrawal(props.viewedInstrumentId, props.budget.id);
});

const steadyStateWithdrawalFormatted: ComputedRef<string> = computed(() =>
  `${globalOptions.Money(steadyStateWithdrawal.value)}/mo`
);

const steadyStateLabel: ComputedRef<string> = computed(() =>
  state.deflateAllMoney ? 'Steady-State Withdrawal (CYM)' : 'Steady-State Withdrawal'
);

const crossoverPoint = computed(() => {
  if (!isCareerPhase.value) return null;
  return state.getCrossoverPoint?.(props.viewedInstrumentId, props.budget.id) || null;
});

const crossoverFormatted = computed(() => {
  return crossoverPoint.value?.formatted || '-';
});

const safeWithdrawalResult = computed(() => {
  if (isCareerPhase.value) {
    return { rate: 0, formatted: '-', tier: 'na' as const, label: '', badgeClass: '' };
  }
  return state.getSafeWithdrawalRate?.(props.viewedInstrumentId, props.budget.id) || {
    rate: 0,
    formatted: '-',
    tier: 'na' as const,
    label: '',
    badgeClass: '',
  };
});

const budgetNetWorth: ComputedRef<string> = computed(() => `${globalOptions.Money(netWorth.value)}`);

const budgetName: ComputedRef<string> = computed(() => isCareerPhase.value
  ? state.getBudgetName(props.budget.id)
  : state.getWithdrawalBudgetName(props.budget.id)
);

const header: ComputedRef<string> = computed(() => state.budgetCardGraphConfig.header(props.viewedInstrumentId));

const graphContent: ComputedRef<Arc[]> = computed(() => {
  if (isCareerPhase.value) {
    return state.cardGraphs[props.viewedInstrumentId]?.[props.budget.id] || [];
  } else {
    const summary = viewedWithdrawalSummary.value;
    if (!summary) return [];
    return [
      { label: 'Growth', value: Number(summary.lifetimeGrowth), color: globalOptions.colorPalette[0] },
      { label: 'Withdrawals', value: Number(summary.lifetimeWithdrawal), color: globalOptions.colorPalette[2] },
    ];
  }
});

const alertButtonIsDisabled = (): void => alert('Create an instrument to use this action');

const defaultContributionSummary = computed(() => {
  if (!isCareerPhase.value || isDefault.value) return null;
  try {
    return state.getContributionSchedule(props.viewedInstrumentId, constants.DEFAULT);
  } catch {
    return null;
  }
});

const appreciationDelta = computed(() => {
  if (!isCareerPhase.value || isDefault.value || !defaultContributionSummary.value || !viewedContributionSummary.value) {
    return null;
  }
  const defaultSched = defaultContributionSummary.value.amortizationSchedule;
  const currentSched = viewedContributionSummary.value.amortizationSchedule;
  const defaultTotal = defaultSched.length > 0
    ? Number(defaultSched.slice(-1)[0].currentBalance)
    : Number(defaultContributionSummary.value.lifetimeContribution + defaultContributionSummary.value.lifetimeGrowth);
  const currentTotal = currentSched.length > 0
    ? Number(currentSched.slice(-1)[0].currentBalance)
    : Number(viewedContributionSummary.value.lifetimeContribution + viewedContributionSummary.value.lifetimeGrowth);
  const extraTotal = currentTotal - defaultTotal;

  if (!extraTotal || extraTotal <= 0 || Number.isNaN(extraTotal)) return null;
  return {
    extraTotal,
    extraTotalText: `+${globalOptions.Money(extraTotal)}`,
  };
});

const cardHeaderBadge = computed<CardBadge | null>(() => {
  if (isCareerPhase.value) {
    if (!appreciationDelta.value) return null;
    return {
      text: appreciationDelta.value.extraTotalText,
      badgeClass: 'badge-success',
    };
  } else {
    if (
      !safeWithdrawalResult.value ||
      safeWithdrawalResult.value.tier === 'na' ||
      !safeWithdrawalResult.value.label ||
      safeWithdrawalResult.value.label === 'N/A'
    ) {
      return null;
    }
    return {
      text: `${safeWithdrawalResult.value.label} (${safeWithdrawalResult.value.formatted})`,
      badgeClass: safeWithdrawalResult.value.badgeClass || 'badge-primary',
    };
  }
});

const subtitle: ComputedRef<string> = computed(() =>
  isDefault.value ? `Baseline · ${budgetAmount.value}` : budgetAmount.value
);

const metrics: ComputedRef<CardMetricRow[]> = computed(() => {
  const rows: CardMetricRow[] = [
    {
      label: netWorthLabel.value,
      value: budgetNetWorth.value,
    },
    {
      label: 'Amount',
      value: budgetAmount.value,
    },
  ];

  if (isCareerPhase.value && !isDefault.value && appreciationDelta.value) {
    rows.push({
      label: 'Extra Net Worth',
      value: appreciationDelta.value.extraTotalText,
      rowClass: 'bg-success/10',
      labelClass: 'text-success font-semibold',
      valueClass: 'text-success',
    });
  }

  if (!isCareerPhase.value && !isDefault.value) {
    if (props.budget.relative > state.desiredNetIncome) {
      rows.push({
        label: 'vs Target',
        value: `+${globalOptions.Money(props.budget.relative - state.desiredNetIncome)}/mo`,
        valueClass: 'text-success font-semibold',
      });
    } else if (props.budget.relative < state.desiredNetIncome) {
      rows.push({
        label: 'vs Target',
        value: `-${globalOptions.Money(state.desiredNetIncome - props.budget.relative)}/mo`,
        valueClass: 'text-warning font-semibold',
      });
    } else {
      rows.push({
        label: 'vs Target',
        value: `${globalOptions.Money(0)}/mo`,
        valueClass: 'text-primary font-semibold',
      });
    }
  } else if (isCareerPhase.value && !isDefault.value) {
    rows.push({
      label: 'Extra',
      value: `+${globalOptions.Money(props.budget.relative)}/mo`,
      valueClass: 'text-success font-semibold',
    });
  }

  rows.push({
    label: periodLabel.value,
    value: budgetPeriodCount.value,
  });

  if (isCareerPhase.value && state.instruments.length) {
    rows.push({
      label: 'Crossover Point',
      value: crossoverFormatted.value,
      tooltip: 'Crossover Point (Growth >= Contribution)',
    });
  }

  if (!isCareerPhase.value && state.instruments.length) {
    rows.push({
      label: 'Withdrawal Rate',
      value: safeWithdrawalResult.value.formatted,
      tooltip: 'Safe Withdrawal Rate (SWR)',
      badge:
        safeWithdrawalResult.value.tier !== 'na'
          ? {
              text: safeWithdrawalResult.value.label,
              badgeClass: safeWithdrawalResult.value.badgeClass,
            }
          : null,
    });
  }

  if (isCareerPhase.value && state.instruments.length) {
    rows.push({
      label: steadyStateLabel.value,
      value: steadyStateWithdrawalFormatted.value,
      tooltip: steadyStateLabel.value,
    });
  }

  return rows;
});

const baseButtons: ComputedRef<Button[]> = computed(() => ([
  {
    text: constants.BTN_DETAILS,
    onClick: () => state.instruments.length ? state.viewBudget(props.budget.id) : alertButtonIsDisabled(),
  },
]));

const editButtons: ComputedRef<Button[]> = computed(() => ([
  ...baseButtons.value,
  {
    text: constants.BTN_EDIT,
    onClick: () => isCareerPhase.value ? state.editBudget(props.budget.id) : state.editWithdrawalBudget(props.budget.id),
  },
  {
    text: constants.BTN_DELETE,
    onClick: () => isCareerPhase.value ? state.deleteBudget(props.budget.id) : state.deleteWithdrawalBudget(props.budget.id),
  },
]));

const buttons: ComputedRef<Button[]> = computed(() => isDefault.value ? baseButtons.value : editButtons.value);
</script>

<template>
  <SummaryCard
    :anchor-id="budget.id"
    :title="budgetName"
    :subtitle="subtitle"
    :badge="cardHeaderBadge"
    :is-baseline="isDefault"
    :menu-text="constants.BTN_MENU"
    :menu-buttons="buttons"
    :show-graph="Boolean(state.instruments.length)"
    :graph-header="header"
    :graph-config="state.budgetCardGraphConfig"
    :graph-content="graphContent"
    :metrics="metrics"
  />
</template>


