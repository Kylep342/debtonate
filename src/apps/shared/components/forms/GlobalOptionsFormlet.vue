<script setup lang="ts">
import { computed } from 'vue';

import htmlid from '../../constants/elementIds';
import constants from '@/apps/shared/constants/constants';
import useGlobalOptionsStore from '@/apps/shared/stores/globalOptions';

const globalOptions = useGlobalOptionsStore();

const sortedCurrencies = computed<Array<string>>(() => globalOptions.currencies.toSorted());
const sortedLanguages = computed<Array<string>>(() => globalOptions.languages.toSorted());

const buttonStyle = (flag) => (flag ? 'btn-success' : 'btn-error');
const buttonText = (flag) => (flag ? constants.BTN_ON : constants.BTN_OFF);
</script>

<template>
  <h3>Global Options</h3>
  <br>
  <hr>
  <br>
  <div :class="['formInputs']">
    <collapsible-card>
      <template #cardTitle>
        <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
          Periods as Dates
        </h3>
      </template>
      <template #cardTitleActions>
        <div>
          <base-button
            :class="buttonStyle(globalOptions.periodsAsDates)"
            @click="globalOptions.togglePeriodsAsDates"
          >
            {{ buttonText(globalOptions.periodsAsDates) }}
          </base-button>
        </div>
      </template>
      <template #cardBody>
        <div :class="['text-base', 'max-w-prose']">
          <p>
            When enabled this displays all period tags as dates (relative to
            today)
          </p>
          <br>
          <p>Next Period: {{ globalOptions.Period(1, true) }}</p>
        </div>
      </template>
    </collapsible-card>
    <collapsible-card>
      <template #cardTitle>
        <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
          Currency
        </h3>
      </template>
      <template #cardTitleActions>
        <div>
          <select
            :id="`${htmlid.GLOBAL_OPTIONS_ID}-currency`"
            v-model="globalOptions.currency"
            class="select select-bordered w-full max-w-xs"
          >
            <option
              v-for="currency in sortedCurrencies"
              :key="currency"
              :value="currency"
            >
              {{ currency }}
            </option>
          </select>
        </div>
      </template>
      <template #cardBody>
        <p>Money: {{ globalOptions.Money(100) }}</p>
      </template>
    </collapsible-card>
    <collapsible-card>
      <template #cardTitle>
        <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
          Locale
        </h3>
      </template>
      <template #cardTitleActions>
        <div>
          <select
            :id="`${htmlid.GLOBAL_OPTIONS_ID}-language`"
            v-model="globalOptions.language"
            class="select select-bordered w-full max-w-xs"
          >
            <option
              v-for="language in sortedLanguages"
              :key="language"
              :value="language"
            >
              {{ language }}
            </option>
          </select>
        </div>
      </template>
      <template #cardBody>
        <p>Localization setting for formatting numbers and dates</p>
        <br>
        <p>Money: {{ globalOptions.Money(100) }}</p>
        <p>Next Period: {{ globalOptions.Period(1, true) }}</p>
        <p>Percent: {{ globalOptions.Percent(3.42) }}</p>
      </template>
    </collapsible-card>
  </div>
</template>
