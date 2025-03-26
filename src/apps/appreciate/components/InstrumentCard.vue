<script setup lang="ts">
import { computed } from 'vue';
import { IInstrument } from 'moneyfunx';

import useAppreciateCoreStore from '../stores/core';
import constants from '@/apps/shared/constants/constants';
import useGlobalOptionsStore from '@/apps/shared/stores/globalOptions';
import { Button } from '@/apps/shared/types/app';

const props = defineProps<{
  instrument: IInstrument
}>();

const globalOptions = useGlobalOptionsStore();
const state = useAppreciateCoreStore();

const instrumentCurrentBalance = computed<string>(() => `${globalOptions.Money(props.instrument.currentBalance)}`);
const instrumentInterestRate = computed<string>(() => `${globalOptions.Percent(props.instrument.annualRate * 100)}`);
const instrumentAnnualLimit = computed<string>(() => `${globalOptions.Money(props.instrument.annualLimit)}`);
const instrumentMaxMonthlyContribution = computed<string>(() => `${globalOptions.Money(props.instrument.annualLimit / 12)}/month`);

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
          <base-menu :menu="constants.BTN_MENU" :buttons="getButtons(instrument.id)" />
        </div>
      </div>
    </template>
    <template #cardBody>
      <base-table :class="['table-sm']">
        <template #body>
          <tbody>
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
              <td>Max Monthly Contribution</td>
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
