<script setup lang="ts">
import { contributionTypes, withdrawalTypes } from 'moneyfunx';
import { computed, ComputedRef } from 'vue';

import constants from '@/apps/appreciate/constants/constants';
import { useAppreciateCoreStore, AppreciateCoreStore } from '@/apps/appreciate/stores/core';
import ColorDot from '@/apps/shared/components/ColorDot.vue';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { Button } from '@/apps/shared/types/app';
import { MonthlyBudget } from '@/apps/shared/types/core';
import { Arc } from '@/apps/shared/types/graph';

const props = defineProps<{
  budget: MonthlyBudget,
  viewedInstrumentId: string,
}>();

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
const state: AppreciateCoreStore = useAppreciateCoreStore();

const isCareerPhase: ComputedRef<boolean> = computed(() => state.viewPhase === constants.PHASE_CAREER);

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
    const total = Number(viewedContributionSummary.value.lifetimeContribution + viewedContributionSummary.value.lifetimeGrowth);
    return state.deflateAllMoney
      ? state.deflate(
        total,
        state.getNumContributions(constants.TOTALS, props.budget.id)
      )
      : total;
  } else if (viewedWithdrawalSummary.value) {
    // In retirement, show ending balance
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

const budgetAmount: ComputedRef<string> = computed(() => isCareerPhase.value
  ? `${globalOptions.Money(props.budget.absolute)}/month`
  : `${globalOptions.Money(props.budget.absolute)}/year`
);

const periodLabel: ComputedRef<string> = computed(() => {
  if (isCareerPhase.value) {
    return globalOptions.periodsAsDates ? 'Retire on' : 'Contributions';
  } else {
    return globalOptions.periodsAsDates ? 'Deplete on' : 'Withdrawals';
  }
});

const budgetPeriodCount: ComputedRef<string | number | Date> = computed(() => {
  if (isCareerPhase.value && viewedContributionSummary.value) {
    return globalOptions.Period(viewedContributionSummary.value.amortizationSchedule.length, true);
  } else if (viewedWithdrawalSummary.value) {
    return globalOptions.Period(viewedWithdrawalSummary.value.amortizationSchedule.length, true);
  }
  return 0;
});

const budgetNetWorth: ComputedRef<string> = computed(() => `${globalOptions.Money(netWorth.value)}`);

const budgetName: ComputedRef<string> = computed(() => isCareerPhase.value
  ? state.getBudgetName(props.budget.id)
  : state.getWithdrawalBudgetName(props.budget.id)
);

const header: ComputedRef<string> = computed(() => state.budgetCardGraphConfig.header(props.viewedInstrumentId));

const graphContent: ComputedRef<Arc[]> = computed(() => {
  if (isCareerPhase.value) {
    return state.cardGraphs[props.viewedInstrumentId][props.budget.id];
  } else {
    // Withdrawal Donut
    const summary = viewedWithdrawalSummary.value;
    if (!summary) return [];
    return [
      { label: 'Growth', value: Number(summary.lifetimeGrowth), color: globalOptions.colorPalette[0] },
      { label: 'Withdrawals', value: Number(summary.lifetimeWithdrawal), color: globalOptions.colorPalette[2] },
    ];
  }
});

const alertButtonIsDisabled = (): void => alert('Create an instrument to use this action');

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

const buttons: ComputedRef<Button[]> = computed(() => props.budget.id === constants.DEFAULT && isCareerPhase.value ? baseButtons.value : editButtons.value);
</script>

<template>
  <base-card
    :class="['w-full', 'bg-base-100', 'min-w-0', 'max-w-full']"
    :body-classes="['p-3', 'overflow-hidden', 'w-full', 'max-w-full']"
  >
    <template #cardTitle>
      <div class="card-actions flow-root w-full min-w-0">
        <div :class="['flex', 'justify-between', 'items-center', 'pr-2', 'min-w-0']">
          <h2 :class="['cardHeaderTitle', 'p-2', 'truncate', 'min-w-0', 'font-semibold', 'text-base']">
            {{ budgetName }}
          </h2>
          <base-menu
            :text="constants.BTN_MENU"
            :buttons="buttons"
            :classes="['btn-sm']"
          />
        </div>
      </div>
    </template>
    <template #cardBody>
      <h3
        v-if="state.instruments.length"
        class="text-center font-medium text-sm truncate mb-1"
      >
        {{ header }}
      </h3>
      <donut-graph
        v-if="state.instruments.length"
        :config="state.budgetCardGraphConfig"
        :graph="graphContent"
        :anchor-id="budget.id"
      />
      <base-table :class="['table-xs', 'w-full', 'max-w-full']">
        <template #body>
          <tbody>
            <template v-if="state.instruments.length">
              <tr
                v-for="(datum) in graphContent"
                :key="datum.label"
              >
                <td class="truncate max-w-[110px]">
                  <ColorDot :color="datum.color || ''" />{{ datum.label }}
                </td>
                <td :class="['text-right', 'whitespace-nowrap']">
                  <b>{{ globalOptions.Money(datum.value) }}</b>
                </td>
              </tr>
            </template>
            <tr>
              <td class="truncate max-w-[110px]">
                Amount
              </td>
              <td :class="['text-right', 'whitespace-nowrap']">
                <b>{{ budgetAmount }}</b>
              </td>
            </tr>
            <tr>
              <td class="truncate max-w-[110px]">
                {{ periodLabel }}
              </td>
              <td :class="['text-right', 'whitespace-nowrap']">
                <b>{{ budgetPeriodCount }}</b>
              </td>
            </tr>
            <tr>
              <td class="truncate max-w-[110px]">
                {{ netWorthLabel }}
              </td>
              <td :class="['text-right', 'whitespace-nowrap']">
                <b>{{ budgetNetWorth }}</b>
              </td>
            </tr>
          </tbody>
        </template>
      </base-table>
    </template>
  </base-card>
</template>
