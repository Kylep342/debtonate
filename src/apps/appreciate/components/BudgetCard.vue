<script setup lang="ts">
import * as moneyfunx from 'moneyfunx';
import { computed, ComputedRef } from 'vue';

import constants from '@/apps/appreciate/constants/constants';
import { useAppreciateCoreStore, AppreciateCoreStore }  from '@/apps/appreciate/stores/core';
import ColorDot from '@/apps/shared/components/ColorDot.vue';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { Button } from '@/apps/shared/types/app';
import { MonthlyBudget } from '@/apps/shared/types/core';
import { DonutGraphContent } from '@/apps/shared/types/graph';

const props = defineProps<{
  budget: MonthlyBudget,
  viewedInstrumentId: string,
}>();

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
const state: AppreciateCoreStore = useAppreciateCoreStore();

const totalsContributionSummary: ComputedRef<moneyfunx.ContributionSchedule> = computed(() => state.getContributionSchedule(constants.TOTALS, props.budget.id));

const netWorth: ComputedRef<number> = computed(() => state.deflateAllMoney
  ? state.deflate(
    totalsContributionSummary.value.lifetimeContribution + totalsContributionSummary.value.lifetimeGrowth,
    state.getNumContributions(constants.TOTALS, props.budget.id)
  )
  : totalsContributionSummary.value.lifetimeContribution + totalsContributionSummary.value.lifetimeGrowth
);
const netWorthLabel: ComputedRef<string> = computed(() => state.deflateAllMoney ? 'Retirement Balance (CYM)' : 'Retirement Balance' );

const budgetAmount: ComputedRef<string> = computed(() => `${globalOptions.Money(props.budget.absolute)}/month`);
const budgetContributions: ComputedRef<number> = computed(() => globalOptions.Period(totalsContributionSummary.value.amortizationSchedule.length, true));
const budgetNetWorth: ComputedRef<string> = computed(() => `${globalOptions.Money(netWorth.value)}`);

const contributionsLabel: ComputedRef<string> = computed(() => globalOptions.periodsAsDates ? 'Retire on' : 'Contributions')
const budgetName: ComputedRef<string> = computed(() => state.getBudgetName(props.budget.id));
const header: ComputedRef<string> = computed(() => state.budgetCardGraphConfig.header(props.viewedInstrumentId));

const graphContent: ComputedRef<DonutGraphContent> = computed(() => state.cardGraphs[props.viewedInstrumentId][props.budget.id])

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
    onClick: () => state.editBudget(props.budget.id),
  },
  {
    text: constants.BTN_DELETE,
    onClick: () => state.deleteBudget(props.budget.id),
  },
]));

const buttons: ComputedRef<Button[]> = computed(() => props.budget.id === constants.DEFAULT ? baseButtons.value : editButtons.value);
</script>

<template>
  <base-card :class="['w-75', 'bg-base-100']">
    <template #cardTitle>
      <div class="card-actions flow-root">
        <div :class="['flex', 'justify-between', 'pr-4']">
          <h2 :class="['cardHeaderTitle', 'float-left', 'p-4']">{{ budgetName }}</h2>
          <base-menu :text="constants.BTN_MENU" :buttons="buttons" />
        </div>
      </div>
    </template>
    <template #cardBody>
      <h3 v-if="state.instruments.length">{{ header }}</h3>
      <donut-graph
        v-if="state.instruments.length"
        :config="state.budgetCardGraphConfig"
        :graph="graphContent"
        :anchorId="budget.id"
      />
      <base-table :class="['table-sm']">
        <template #body>
          <tbody>
            <tr v-if="state.instruments.length" v-for="(datum) in graphContent" :key="datum.label">
              <td><ColorDot :color="datum.color" />{{ datum.label }}</td>
              <td :class="['text-right']"><b>{{ globalOptions.Money(datum.value) }}</b></td>
            </tr>
            <tr>
              <td>Amount</td>
              <td :class="['text-right']"><b>{{ budgetAmount }}</b></td>
            </tr>
            <tr>
              <td>{{ contributionsLabel }}</td>
              <td :class="['text-right']"><b>{{ budgetContributions }}</b></td>
            </tr>
            <tr>
              <td>{{ netWorthLabel }}</td>
              <td :class="['text-right']"><b>{{ budgetNetWorth }}</b></td>
            </tr>
          </tbody>
        </template>
      </base-table>
    </template>
  </base-card>
</template>
