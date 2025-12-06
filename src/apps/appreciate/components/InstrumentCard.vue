<script setup lang="ts">
import * as moneyfunx from 'moneyfunx';
import { computed, ComputedRef } from 'vue';

import { useAppreciateCoreStore, AppreciateCoreStore } from '@/apps/appreciate/stores/core';
import constants from '@/apps/appreciate/constants/constants';
import ColorDot from '@/apps/shared/components/ColorDot.vue';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { Button } from '@/apps/shared/types/app';
import { DonutGraphContent } from '@/apps/shared/types/graph';

const props = defineProps<{
  instrument: moneyfunx.IInstrument,
  viewedBudgetId: string,
}>();

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
const state: AppreciateCoreStore = useAppreciateCoreStore();

const instrumentCurrentBalance: ComputedRef<string> = computed(() => `${globalOptions.Money(props.instrument.currentBalance)}`);
const instrumentInterestRate: ComputedRef<string> = computed(() => `${globalOptions.Percent(props.instrument.annualRate * 100)}`);
const instrumentAnnualLimit: ComputedRef<string> = computed(() => `${globalOptions.Money(props.instrument.annualLimit)}`);
const instrumentMaxMonthlyContribution: ComputedRef<string> = computed(() => `${globalOptions.Money(props.instrument.annualLimit / constants.PERIODS_PER_YEAR)}/month`);

const instrumentName: ComputedRef<string> = computed(() => state.getInstrumentName(props.instrument.id));
const header: ComputedRef<string> = computed(() => state.instrumentCardGraphConfig.header(props.viewedBudgetId));

const graphContent: ComputedRef<DonutGraphContent> = computed(() => state.cardGraphs[props.instrument.id][props.viewedBudgetId])

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

const buttons: ComputedRef<Button[]> = computed(() => props.instrument.id === constants.TOTALS ? baseButtons.value : editButtons.value);
</script>

<template>
  <base-card :class="['w-75', 'bg-base-100']">
    <template #cardTitle>
      <div :class="['card-actions', 'flow-root', 'p-0']">
        <div :class="['flex', 'justify-between', 'pr-4']">
          <h2 :class="['cardHeaderTitle', 'float-left', 'p-4']">{{ instrumentName }}</h2>
          <base-menu :text="constants.BTN_MENU" :buttons="buttons" />
        </div>
      </div>
    </template>
    <template #cardBody>
      <h3 v-if="state.instruments.length">{{ header }}</h3>
      <donut-graph
        v-if="state.instruments.length"
        :config="state.instrumentCardGraphConfig"
        :graph="graphContent"
        :anchorId="instrument.id"
      />
      <base-table :class="['table-sm']">
        <template #body>
          <tbody>
            <tr v-if="state.instruments.length" v-for="(datum) in graphContent" :key="datum.label">
              <td><ColorDot :color="datum.color" />{{ datum.label }}</td>
              <td :class="['text-right']"><b>{{ globalOptions.Money(datum.value) }}</b></td>
            </tr>
            <tr>
              <td>Current Balance</td>
              <td :class="['text-right']"><b>{{ instrumentCurrentBalance }}</b></td>
            </tr>
            <tr>
              <td>Interest Rate</td>
              <td :class="['text-right']"><b>{{ instrumentInterestRate }}</b></td>
            </tr>
            <tr v-if="instrument.annualLimit">
              <td>Annual Limit</td>
              <td :class="['text-right']"><b>{{ instrumentAnnualLimit }}</b></td>
            </tr>
            <tr v-if="instrument.annualLimit">
              <td>Max Contribution</td>
              <td :class="['text-right']"><b>{{ instrumentMaxMonthlyContribution }}</b></td>
            </tr>
          </tbody>
        </template>
      </base-table>
    </template>
  </base-card>
</template>
