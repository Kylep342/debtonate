<script setup lang="ts">
import { computed } from 'vue';

import constants from '@/apps/appreciate/constants/constants';
import useAppreciateCoreStore from '@/apps/appreciate/stores/core';
import useGlobalOptionsStore from '@/apps/shared/stores/globalOptions';
import { Button } from '@/apps/shared/types/app';
import { MonthlyBudget } from '@/apps/shared/types/core';
import { Arc } from '@/apps/shared/types/graph';

const props = defineProps<{
  budget: MonthlyBudget,
  viewedInstrumentId: string,
}>();

const globalOptions = useGlobalOptionsStore();
const state = useAppreciateCoreStore();

const totalsContributionSummary = computed(() => state.getContributionSchedule(constants.TOTALS, props.budget.id));

const netWorth = computed<number>(() => state.deflateAllMoney
  ? state.deflate(
    totalsContributionSummary.value.lifetimeContribution + totalsContributionSummary.value.lifetimeGrowth,
    state.getNumContributions(constants.TOTALS, props.budget.id)
  )
  : totalsContributionSummary.value.lifetimeContribution + totalsContributionSummary.value.lifetimeGrowth
);
const netWorthLabel = computed<string>(() => state.deflateAllMoney ? 'Retirement Balance (CYM)' : 'Retirement Balance' );

const budgetAmount = computed<string>(() => `${globalOptions.Money(props.budget.absolute)}/month`);
const budgetContributions = computed<number>(() => globalOptions.Period(totalsContributionSummary.value.amortizationSchedule.length, true));
const budgetContributionTotals = computed<number>(() => globalOptions.Money(totalsContributionSummary.value.amortizationSchedule.length * props.budget.absolute));
const budgetNetWorth = computed<string>(() => `${globalOptions.Money(netWorth.value)}`);

const contributionsLabel = computed<string>(() => globalOptions.periodsAsDates ? 'Retire on' : 'Contributions')

const graph = computed(() => state.cardGraphs[props.viewedInstrumentId][props.budget.id])

const alertButtonIsDisabled = () => alert('Create an instrument to use this action');

const baseButtons = computed<Array<Button>>(() => ([
  {
    text: constants.BTN_DETAILS,
    onClick: () => state.instruments.length ? state.viewBudget(props.budget.id) : alertButtonIsDisabled(),
  },
]));

const editButtons = computed<Array<Button>>(() => ([
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

const getButtons = (budgetId): Array<Button> => budgetId === constants.DEFAULT ? baseButtons.value : editButtons.value;
</script>

<template>
  <base-card :class="['w-75', 'bg-base-100']">
    <template #cardTitle>
      <div class="card-actions flow-root">
        <div :class="['flex', 'justify-between', 'pr-4']">
          <h2 :class="['cardHeaderTitle', 'float-left', 'p-4']">
            {{ state.getBudgetName(budget.id) }}
          </h2>
          <base-menu :text="constants.BTN_MENU" :buttons="getButtons(budget.id)" />
        </div>
      </div>
    </template>
    <template #cardBody>
      <donut-graph
        v-if="state.instruments.length"
        :config="state.budgetCardGraphConfig"
        :graph="graph"
        :anchorId="budget.id"
      />
      <base-table :class="['table-sm']">
        <template #body>
          <tbody>
            <tr>
              <td>Amount</td>
              <td :class="['text-right']">
                <b>{{ budgetAmount }}</b>
              </td>
            </tr>
            <tr>
              <td>Total Contributed</td>
              <td :class="['text-right']">
                <b>{{ budgetContributionTotals }}</b>
              </td>
            </tr>
            <tr>
              <td>{{ netWorthLabel }}</td>
              <td :class="['text-right']">
                <b>{{ budgetNetWorth }}</b>
              </td>
            </tr>
          </tbody>
        </template>
      </base-table>
    </template>
  </base-card>
</template>
