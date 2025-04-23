<script setup lang="ts">
import { computed } from 'vue';
import { IInstrument } from 'moneyfunx';

import useAppreciateCoreStore from '@/apps/appreciate/stores/core';
import ColorDot from '@/apps/shared/components/ColorDot.vue';
import { Button } from '@/apps/shared/types/app';
import constants from '@/apps/shared/constants/constants';
import useGlobalOptionsStore from '@/apps/shared/stores/globalOptions';

const props = defineProps<{
  instrument: IInstrument,
  viewedBudgetId: string,
}>();

const globalOptions = useGlobalOptionsStore();
const state = useAppreciateCoreStore();

const instrumentCurrentBalance = computed<string>(() => `${globalOptions.Money(props.instrument.currentBalance)}`);
const instrumentInterestRate = computed<string>(() => `${globalOptions.Percent(props.instrument.annualRate * 100)}`);
const instrumentAnnualLimit = computed<string>(() => `${globalOptions.Money(props.instrument.annualLimit)}`);
const instrumentMaxMonthlyContribution = computed<string>(() => `${globalOptions.Money(props.instrument.annualLimit / constants.PERIODS_PER_YEAR)}/month`);

const graph = computed(() => state.cardGraphs[props.instrument.id][props.viewedBudgetId])

const alertButtonIsDisabled = () => alert('Create an instrument to use this action');

const baseButtons = computed<Array<Button>>(() => ([
  {
    text: constants.BTN_DETAILS,
    onClick: () => state.instruments.length ? state.viewInstrument(props.instrument.id) : alertButtonIsDisabled(),
  },
]));

const editButtons = computed<Array<Button>>(() => ([
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

const getButtons = (instrumentId): Array<Button> => instrumentId === constants.TOTALS ? baseButtons.value : editButtons.value;
</script>

<template>
  <base-card :class="['w-75', 'bg-base-100']">
    <template #cardTitle>
      <div :class="['card-actions', 'flow-root', 'p-0']">
        <div :class="['flex', 'justify-between', 'pr-4']">
          <h2 :class="['cardHeaderTitle', 'float-left', 'p-4']">
            {{ state.getInstrumentName(instrument.id) }}
          </h2>
          <base-menu :text="constants.BTN_MENU" :buttons="getButtons(instrument.id)" />
        </div>
      </div>
    </template>
    <template #cardBody>
      <h3 v-if="state.instruments.length">{{ state.instrumentCardGraphConfig.header(viewedBudgetId) }}</h3>
      <donut-graph
        v-if="state.instruments.length"
        :config="state.instrumentCardGraphConfig"
        :graph="graph"
        :anchorId="instrument.id"
      />
      <base-table :class="['table-sm']">
        <template #body>
          <tbody>
            <tr v-if="state.instruments.length" v-for="(datum) in graph" :key="datum.label">
              <td><ColorDot :color="datum.color" />{{ datum.label }}</td>
              <td :class="['text-right']">
                <b>{{ globalOptions.Money(datum.value) }}</b>
              </td>
            </tr>
            <tr>
              <td>Current Balance</td>
              <td :class="['text-right']">
                <b>{{ instrumentCurrentBalance }}</b>
              </td>
            </tr>
            <tr>
              <td>Interest Rate</td>
              <td :class="['text-right']">
                <b>{{ instrumentInterestRate }}</b>
              </td>
            </tr>
            <tr v-if="instrument.annualLimit">
              <td>Annual Limit</td>
              <td :class="['text-right']">
                <b>{{ instrumentAnnualLimit }}</b>
              </td>
            </tr>
            <tr v-if="instrument.annualLimit">
              <td>Max Contribution</td>
              <td :class="['text-right']">
                <b>{{ instrumentMaxMonthlyContribution }}</b>
              </td>
            </tr>
          </tbody>
        </template>
      </base-table>
    </template>
  </base-card>
</template>
