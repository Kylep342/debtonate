<script setup lang="ts">
import { computed, ref, onBeforeUpdate, ComputedRef } from 'vue';

import htmlid from '@/apps/shared/constants/elementIds';
import constants from '@/apps/shared/constants/constants';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { Locale } from '@/apps/shared/types/app';

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();

const cardRefs = ref([]);

onBeforeUpdate(() => {
  cardRefs.value = [];
});

const collapseAll = () => {
  cardRefs.value.forEach(card => card.collapse());
};

const expandAll = () => {
  cardRefs.value.forEach(card => card.expand());
};

defineExpose({
  collapseAll,
  expandAll,
});


type Option = {
  option: string,
  label: string
}

const sortedCurrencies: ComputedRef<Option[]> = computed(() => {
  const options = globalOptions.locales.map((locale: Locale) => {
    return <Option>{
      option: locale.currency,
      label: `${locale.currency} (${locale.flag})`,
    };
  });
  return options.sort((a: Option, b: Option) => a.option.localeCompare(b.option));
});
const sortedLanguages: ComputedRef<Option[]> = computed(() => {
  const options = globalOptions.locales.map((locale: Locale) => {
    return <Option>{
      option: locale.code,
      label: `${locale.code} (${locale.flag})`
    };
  });
  return options.sort((a: Option, b: Option) => a.option.localeCompare(b.option));
});

const buttonStyle = (flag: boolean): string => (flag ? 'btn-success' : 'btn-error');
const buttonText = (flag: boolean): string => (flag ? constants.BTN_ON : constants.BTN_OFF);
const themeButtonText = (isDark: boolean): string => (isDark ? 'Light' : 'Dark');
</script>

<template>
  <h3 :class="['pl-4']">Global Options</h3>
  <br>
  <hr>
  <br>
  <div :class="['formInputs']">
    <collapsible-card :ref="el => { if (el) cardRefs.push(el) }">
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
    <collapsible-card :ref="el => { if (el) cardRefs.push(el) }">
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
              :key="currency.option"
              :value="currency.option"
            >
              {{ currency.label }}
            </option>
          </select>
        </div>
      </template>
      <template #cardBody>
        <p>Money: {{ globalOptions.Money(100) }}</p>
      </template>
    </collapsible-card>
    <collapsible-card :ref="el => { if (el) cardRefs.push(el) }">
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
              :key="language.option"
              :value="language.option"
            >
              {{ language.label }}
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
    <collapsible-card :ref="el => { if (el) cardRefs.push(el) }">
      <template #cardTitle>
        <h3 :class="['cardHeaderTitle', 'float-left', 'p-4']">
          Theme
        </h3>
      </template>
      <template #cardTitleActions>
        <div>
          <base-button
            :class="buttonStyle(globalOptions.darkMode)"
            @click="globalOptions.toggleTheme"
          >{{ themeButtonText(globalOptions.darkMode) }}</base-button>
        </div>
      </template>
      <template #cardBody>
        <p>Switch theme to {{ globalOptions.darkMode ? 'light' : 'dark' }} mode</p>
      </template>
    </collapsible-card>
  </div>
</template>
