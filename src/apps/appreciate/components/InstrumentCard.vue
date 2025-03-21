<script setup lang="ts">
import { computed } from 'vue';
import { IInstrument } from 'moneyfunx';

import sharedConstants from '@/apps/shared/constants/constants';
import useAppreciateCoreStore from '@/apps/appreciate/stores/core';
import useGlobalOptionsStore from '@/apps/shared/stores/globalOptions';
import { Button } from '@/apps/shared/types/app';

const props = defineProps<{
  instrument: IInstrument
}>();

const state = useAppreciateCoreStore();
const globalOptions = useGlobalOptionsStore();


const instrumentCurrentBalance = computed<string>(() => `${globalOptions.Money(props.instrument.currentBalance)}`);
const instrumentInterestRate = computed<string>(() => `${globalOptions.Percent(props.instrument.annualRate() * 100)}`);
const instrumentAnnualLimit = computed<string>(() => `${globalOptions.Money(props.instrument.annualLimit())}`);

console.log(props.instrument.currentBalance);
console.log(props.instrument.annualLimit());
console.log(props.instrument.annualRate());

const alertButtonIsDisabled = () => alert('Create a instrument to use this action');

const baseButtons = computed<Array<Button>>(() => ([
  {
    text: sharedConstants.BTN_DETAILS,
    onClick: () => state.instruments.length ? state.viewInstrument(props.instrument.id) : alertButtonIsDisabled(),
  },
]));

const editButtons = computed<Array<Button>>(() => ([
  ...baseButtons.value,
  {
    text: sharedConstants.BTN_EDIT,
    onClick: () => state.editInstrument(props.instrument.id),
  },
  {
    text: sharedConstants.BTN_DELETE,
    onClick: () => state.deleteInstrument(props.instrument.id),
  },
]));

const getButtons = (instrumentId): Array<Button> => instrumentId === sharedConstants.TOTALS ? baseButtons.value : editButtons.value;
</script>

<template>
  <base-card :class="['w-75', 'bg-base-100']">
    <template #cardTitle>
      <div :class="['card-actions', 'flow-root', 'p-0']">
        <div :class="['flex', 'justify-between', 'pr-4']">
          <h2 :class="['cardHeaderTitle', 'float-left', 'p-4']">
            {{ state.getInstrumentName(instrument.id) }}
          </h2>
          <base-menu :menu="sharedConstants.BTN_MENU" :buttons="getButtons(instrument.id)" />
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
            <tr v-if="instrumentAnnualLimit">
              <td>Annual Limit</td>
              <td :class="['text-right']">
                <b>{{ instrumentAnnualLimit }}</b>
              </td>
            </tr>
          </tbody>
        </template>
      </base-table>
    </template>
  </base-card>
</template>
