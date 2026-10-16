<script setup lang="ts">
import { computed, ComputedRef } from 'vue';

import { useAppreciateCoreStore, AppreciateCoreStore } from '@/apps/appreciate/stores/core';
import constants from '@/apps/appreciate/constants/constants';
import SummaryCard from '@/apps/shared/components/SummaryCard.vue';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { Button, CardBadge, CardMetricRow } from '@/apps/shared/types/app';
import { Arc } from '@/apps/shared/types/graph';
import { useBreakpoint } from '@/apps/shared/functions/viewport';
import { UIInstrument } from '@/apps/appreciate/types/core';

const props = defineProps<{
  instrument: UIInstrument;
  viewedBudgetId: string;
}>();

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
const state: AppreciateCoreStore = useAppreciateCoreStore();
const { isMobile } = useBreakpoint();

const isCareerPhase = computed(() => state.viewPhase === constants.PHASE_CAREER);
const isTotals = computed(() => props.instrument.id === constants.TOTALS);

const instrumentCurrentBalance: ComputedRef<string> = computed(() => `${globalOptions.Money(props.instrument.currentBalance)}`);
const instrumentInterestRate: ComputedRef<string> = computed(() => `${globalOptions.Percent(props.instrument.annualRate * 100)}`);
const instrumentAnnualLimit: ComputedRef<string> = computed(() => `${globalOptions.Money(props.instrument.annualLimit)}`);
const instrumentMaxMonthlyContribution: ComputedRef<string> = computed(() => `${globalOptions.Money(props.instrument.annualLimit / constants.PERIODS_PER_YEAR)}/month`);

const startingBalance: ComputedRef<string> = computed(() => {
  const careerSchedule = state.getContributionSchedule(
    props.instrument.id,
    state.selectedCareerBudgetId || constants.DEFAULT
  );
  const lastBalance = careerSchedule?.amortizationSchedule?.slice(-1)[0]?.currentBalance || 0;
  return `${globalOptions.Money(lastBalance)}`;
});

const instrumentName: ComputedRef<string> = computed(() => state.getInstrumentName(props.instrument.id));
const header: ComputedRef<string> = computed(() => state.instrumentCardGraphConfig.header(props.viewedBudgetId));

const graphContent: ComputedRef<Arc[]> = computed(() => {
  if (isCareerPhase.value) {
    return state.cardGraphs[props.instrument.id]?.[props.viewedBudgetId] || [];
  } else {
    const scheduleMap = state.withdrawalSchedules[props.instrument.id];
    if (!scheduleMap || !scheduleMap[props.viewedBudgetId]) {
      return [];
    }
    const summary = scheduleMap[props.viewedBudgetId];
    return [
      { label: 'Growth', value: Number(summary.lifetimeGrowth), color: globalOptions.colorPalette[0] },
      { label: 'Withdrawals', value: Number(summary.lifetimeWithdrawal), color: globalOptions.colorPalette[2] },
    ];
  }
});

const subtitle: ComputedRef<string> = computed(() => {
  if (isTotals.value) {
    return state.instruments.length
      ? `${state.instruments.length} ${state.instruments.length === 1 ? 'Account' : 'Accounts'} · ${instrumentInterestRate.value} APY`
      : 'Portfolio Summary';
  }
  return `${instrumentInterestRate.value} Return · ${instrumentCurrentBalance.value}`;
});

const cardBadge: ComputedRef<CardBadge | null> = computed(() =>
  isTotals.value ? { text: 'Aggregate', badgeClass: 'badge-primary badge-outline' } : null
);

const projectedBalance: ComputedRef<string> = computed(() => {
  const sliceSum = graphContent.value.reduce((acc, item) => acc + (Number(item.value) || 0), 0);
  const total = (Number(props.instrument.currentBalance) || 0) + sliceSum;
  return `${globalOptions.Money(total)}`;
});

const metrics: ComputedRef<CardMetricRow[]> = computed(() => {
  const rows: CardMetricRow[] = isCareerPhase.value
    ? [
        {
          label: 'Current Balance',
          value: instrumentCurrentBalance.value,
        },
        {
          label: 'Retirement Balance',
          value: projectedBalance.value,
        },
      ]
    : [
        {
          label: 'Starting Balance',
          value: startingBalance.value,
        },
      ];

  rows.push({
    label: 'Expected Return',
    value: instrumentInterestRate.value,
    valueClass: 'text-primary',
  });

  if (props.instrument.annualLimit && isCareerPhase.value) {
    rows.push(
      {
        label: 'Annual Limit',
        value: instrumentAnnualLimit.value,
      },
      {
        label: isMobile.value ? 'Max Monthly' : 'Max Contribution',
        value: instrumentMaxMonthlyContribution.value,
      }
    );
  }

  return rows;
});

const alertButtonIsDisabled = (): void => alert('Create an instrument to use this action');

const baseButtons: ComputedRef<Button[]> = computed(() => ([
  {
    text: constants.BTN_DETAILS,
    onClick: () => state.instruments.length ? state.viewInstrument(props.instrument.id) : alertButtonIsDisabled(),
  },
]));

const editButtons: ComputedRef<Button[]> = computed(() => ([
  ...baseButtons.value,
  {
    text: constants.BTN_EDIT,
    onClick: () => state.editInstrument(props.instrument.id),
  },
  {
    text: constants.BTN_DELETE,
    onClick: () => state.deleteInstrument(props.instrument.id),
  },
]));

const buttons: ComputedRef<Button[]> = computed(() => isTotals.value ? baseButtons.value : editButtons.value);
</script>

<template>
  <SummaryCard
    :anchor-id="instrument.id"
    :title="instrumentName"
    :subtitle="subtitle"
    :badge="cardBadge"
    :is-baseline="isTotals"
    :menu-text="constants.BTN_MENU"
    :menu-buttons="buttons"
    :show-graph="Boolean(state.instruments.length)"
    :graph-header="header"
    :graph-config="state.instrumentCardGraphConfig"
    :graph-content="graphContent"
    :metrics="metrics"
  />
</template>


