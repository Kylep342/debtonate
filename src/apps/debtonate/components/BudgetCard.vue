<script setup lang="ts">
import { paymentTypes } from 'moneyfunx';
import { computed, ComputedRef } from 'vue';

import { useDebtonateCoreStore, DebtonateCoreStore } from '@/apps/debtonate/stores/core';
import constants from '@/apps/debtonate/constants/constants';
import SummaryCard from '@/apps/shared/components/SummaryCard.vue';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { Button, CardBadge, CardMetricRow } from '@/apps/shared/types/app';
import { MonthlyBudget } from '@/apps/shared/types/core';
import { Arc } from '@/apps/shared/types/graph';

const props = defineProps<{
  budget: MonthlyBudget;
  viewedLoanId: string;
}>();

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
const state: DebtonateCoreStore = useDebtonateCoreStore();

const isDefault: ComputedRef<boolean> = computed(() => props.budget.id === constants.DEFAULT);

const viewedPaymentSchedule: ComputedRef<paymentTypes.PaymentSchedule> = computed(() =>
  state.getPaymentSchedule(props.viewedLoanId, props.budget.id)
);

const budgetAmount: ComputedRef<string> = computed(() => `${globalOptions.Money(props.budget.absolute)}/month`);
const budgetPayments: ComputedRef<string | number | Date> = computed(() =>
  globalOptions.Period(viewedPaymentSchedule.value.amortizationSchedule.length, true)
);
const budgetTotalPaid: ComputedRef<string> = computed(() =>
  `${globalOptions.Money(viewedPaymentSchedule.value.lifetimeInterest + viewedPaymentSchedule.value.lifetimePrincipal)}`
);

const defaultPaymentSchedule: ComputedRef<paymentTypes.PaymentSchedule | null> = computed(() => {
  if (isDefault.value) return null;
  try {
    return state.getPaymentSchedule(props.viewedLoanId, constants.DEFAULT);
  } catch {
    return null;
  }
});

const payoffDelta = computed(() => {
  if (isDefault.value || !defaultPaymentSchedule.value || !viewedPaymentSchedule.value) {
    return null;
  }
  const defaultMonths = defaultPaymentSchedule.value.amortizationSchedule?.length || 0;
  const currentMonths = viewedPaymentSchedule.value.amortizationSchedule?.length || 0;
  const monthsDiff = defaultMonths - currentMonths;

  const defaultInterest = Number(defaultPaymentSchedule.value.lifetimeInterest) || 0;
  const currentInterest = Number(viewedPaymentSchedule.value.lifetimeInterest) || 0;
  const interestSaved = defaultInterest - currentInterest;

  if (monthsDiff <= 0 && interestSaved <= 0) return null;

  let timeText = '';
  if (monthsDiff > 0) {
    const years = Math.floor(monthsDiff / 12);
    const months = monthsDiff % 12;
    if (years > 0 && months > 0) {
      timeText = `${years}y ${months}m sooner`;
    } else if (years > 0) {
      timeText = `${years}y sooner`;
    } else {
      timeText = `${months}m sooner`;
    }
  }

  return {
    monthsDiff,
    interestSaved,
    interestSavedText: interestSaved > 0 ? `${globalOptions.Money(interestSaved)} saved` : null,
    timeText: timeText || null,
  };
});

const paymentsLabel: ComputedRef<string> = computed(() => globalOptions.periodsAsDates ? 'Debt Free' : 'Payments');
const budgetName: ComputedRef<string> = computed(() => state.getBudgetName(props.budget.id));
const header: ComputedRef<string> = computed(() => state.budgetCardGraphConfig.header(props.viewedLoanId));

const graphContent: ComputedRef<Arc[]> = computed(() => state.cardGraphs[props.viewedLoanId]?.[props.budget.id] || []);

const subtitle: ComputedRef<string> = computed(() =>
  isDefault.value
    ? `Baseline · ${budgetAmount.value}`
    : `${budgetAmount.value} (+${globalOptions.Money(props.budget.relative)}/mo)`
);

const cardBadge: ComputedRef<CardBadge | null> = computed(() => {
  if (payoffDelta.value && (payoffDelta.value.timeText || payoffDelta.value.interestSavedText)) {
    return {
      text: (payoffDelta.value.timeText || payoffDelta.value.interestSavedText)!,
      badgeClass: 'badge-success',
    };
  }
  if (isDefault.value) {
    return {
      text: 'Baseline',
      badgeClass: 'badge-primary badge-outline',
    };
  }
  return null;
});

const metrics: ComputedRef<CardMetricRow[]> = computed(() => {
  const rows: CardMetricRow[] = [
    {
      label: 'Total Paid',
      value: budgetTotalPaid.value,
    },
    {
      label: 'Amount',
      value: budgetAmount.value,
    },
  ];

  if (!isDefault.value) {
    rows.push({
      label: 'Over Minimum',
      value: `+${globalOptions.Money(props.budget.relative)}/mo`,
      valueClass: 'text-success font-semibold',
    });
  }

  if (payoffDelta.value && payoffDelta.value.interestSavedText) {
    rows.push({
      label: 'Interest Saved',
      value: payoffDelta.value.interestSavedText,
      rowClass: 'bg-success/10',
      labelClass: 'text-success font-semibold',
      valueClass: 'text-success',
    });
  }

  if (payoffDelta.value && payoffDelta.value.timeText) {
    rows.push({
      label: 'Time Saved',
      value: payoffDelta.value.timeText,
      rowClass: 'bg-success/10',
      labelClass: 'text-success font-semibold',
      valueClass: 'text-success',
    });
  }

  rows.push({
    label: paymentsLabel.value,
    value: budgetPayments.value,
  });

  return rows;
});

const alertButtonIsDisabled = (): void => alert('Create a loan to use this action');

const baseButtons: ComputedRef<Button[]> = computed(() => ([
  {
    text: constants.BTN_DETAILS,
    onClick: () => state.loans.length ? state.viewBudget(props.budget.id) : alertButtonIsDisabled(),
  },
]));

const editButtons: ComputedRef<Button[]> = computed(() => ([
  ...baseButtons.value,
  {
    text: constants.BTN_EDIT,
    onClick: () => state.editBudget(props.budget.id),
  },
  {
    text: constants.BTN_DELETE,
    onClick: () => state.deleteBudget(props.budget.id),
  },
]));

const buttons: ComputedRef<Button[]> = computed(() => isDefault.value ? baseButtons.value : editButtons.value);
</script>

<template>
  <SummaryCard
    :anchor-id="budget.id"
    :title="budgetName"
    :subtitle="subtitle"
    :badge="cardBadge"
    :is-baseline="isDefault"
    :menu-text="constants.BTN_MENU"
    :menu-buttons="buttons"
    :show-graph="Boolean(state.loans.length)"
    :graph-header="header"
    :graph-config="state.budgetCardGraphConfig"
    :graph-content="graphContent"
    :metrics="metrics"
  />
</template>


