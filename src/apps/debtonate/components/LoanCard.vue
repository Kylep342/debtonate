<script setup lang="ts">
import { computed, ComputedRef } from 'vue';

import constants from '@/apps/debtonate/constants/constants';
import { useDebtonateCoreStore, DebtonateCoreStore } from '@/apps/debtonate/stores/core';
import SummaryCard from '@/apps/shared/components/SummaryCard.vue';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { Button, CardBadge, CardMetricRow } from '@/apps/shared/types/app';
import { Arc } from '@/apps/shared/types/graph';
import { useBreakpoint } from '@/apps/shared/functions/viewport';
import { UIDebtLoan } from '@/apps/debtonate/types/core';

const props = defineProps<{
  loan: UIDebtLoan;
  viewedBudgetId: string;
}>();

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
const state: DebtonateCoreStore = useDebtonateCoreStore();
const { isMobile } = useBreakpoint();

const isTotals: ComputedRef<boolean> = computed(() => props.loan.id === constants.TOTALS);

const loanInterestRate: ComputedRef<string> = computed(() => `${globalOptions.Percent(Number(props.loan.annualRate) * 100)}`);
const loanMinPayment: ComputedRef<string> = computed(() => `${globalOptions.Money(props.loan.minPayment)}/month`);
const loanPrincipal: ComputedRef<string> = computed(() => `${globalOptions.Money(props.loan.principal)}`);
const loanTermInYears: ComputedRef<string> = computed(() => `${props.loan.termInYears}`);
const loanFees: ComputedRef<string | null> = computed(() => props.loan.fees ? `${globalOptions.Money(props.loan.fees)}` : null);

const header: ComputedRef<string> = computed(() => state.loanCardGraphConfig.header(props.viewedBudgetId));
const loanName: ComputedRef<string> = computed(() => state.getLoanName(props.loan.id));

const graphContent: ComputedRef<Arc[]> = computed(() => state.cardGraphs[props.loan.id]?.[props.viewedBudgetId] || []);

const loanTotalPaid: ComputedRef<string> = computed(() => {
  if (graphContent.value.length > 0) {
    const sum = graphContent.value.reduce((acc, item) => acc + (Number(item.value) || 0), 0);
    return `${globalOptions.Money(sum)}`;
  }
  return loanPrincipal.value;
});

const subtitle: ComputedRef<string> = computed(() => {
  if (isTotals.value) {
    return state.loans.length
      ? `${state.loans.length} ${state.loans.length === 1 ? 'Loan' : 'Loans'} · ${loanInterestRate.value} APR`
      : 'Portfolio Summary';
  }
  return `${loanInterestRate.value} APR · ${loanMinPayment.value}`;
});

const cardBadge: ComputedRef<CardBadge | null> = computed(() =>
  isTotals.value ? { text: 'Aggregate', badgeClass: 'badge-primary badge-outline' } : null
);

const metrics: ComputedRef<CardMetricRow[]> = computed(() => {
  const rows: CardMetricRow[] = [
    {
      label: 'Total Paid',
      value: loanTotalPaid.value,
    },
    {
      label: 'Interest Rate',
      value: loanInterestRate.value,
      valueClass: 'text-secondary',
    },
    {
      label: 'Term',
      value: `${loanTermInYears.value} years`,
    },
    {
      label: isMobile.value ? 'Min Payment' : 'Minimum Payment',
      value: loanMinPayment.value,
    },
  ];

  if (Number(props.loan.principal) !== Number(props.loan.currentBalance)) {
    rows.push({
      label: 'Original Principal',
      value: loanPrincipal.value,
    });
  }

  if (loanFees.value) {
    rows.push({
      label: 'Fees',
      value: loanFees.value,
    });
  }

  return rows;
});

const alertButtonIsDisabled = (): void => alert('Create a loan to use this action');

const baseButtons: ComputedRef<Button[]> = computed(() => ([
  {
    text: constants.BTN_DETAILS,
    onClick: () => state.loans.length ? state.viewLoan(props.loan.id) : alertButtonIsDisabled(),
  },
  {
    text: constants.BTN_REFINANCE,
    onClick: () => state.loans.length ? state.refinanceLoan(props.loan.id) : alertButtonIsDisabled(),
  },
]));

const editButtons: ComputedRef<Button[]> = computed(() => ([
  ...baseButtons.value,
  {
    text: constants.BTN_EDIT,
    onClick: () => state.editLoan(props.loan.id),
  },
  {
    text: constants.BTN_DELETE,
    onClick: () => state.deleteLoan(props.loan.id),
  },
]));

const buttons: ComputedRef<Button[]> = computed(() => isTotals.value ? baseButtons.value : editButtons.value);
</script>

<template>
  <SummaryCard
    :anchor-id="loan.id"
    :title="loanName"
    :subtitle="subtitle"
    :badge="cardBadge"
    :is-baseline="isTotals"
    :menu-text="constants.BTN_MENU"
    :menu-buttons="buttons"
    :show-graph="Boolean(state.loans.length)"
    :graph-header="header"
    :graph-config="state.loanCardGraphConfig"
    :graph-content="graphContent"
    :metrics="metrics"
  />
</template>


