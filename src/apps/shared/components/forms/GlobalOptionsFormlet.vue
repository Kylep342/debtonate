<script setup lang="ts">
import { computed, ComputedRef, watch } from 'vue';

import htmlid from '@/apps/shared/constants/elementIds';
import constants from '@/apps/shared/constants/constants';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { Locale } from '@/apps/shared/types/app';

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();

const collapseAll = () => {};
const expandAll = () => {};

defineExpose({
  collapseAll,
  expandAll,
});


type Option = {
  option: string,
  label: string
}

const activeLocale = computed<Locale>(() => {
  return globalOptions.locales.find((locale: Locale) => locale.code === globalOptions.language)
    || globalOptions.locales[0];
});

const getCurrencyFlag = (currencyCode: string): string => {
  if (activeLocale.value && activeLocale.value.currency === currencyCode) {
    return activeLocale.value.flag;
  }
  if (currencyCode === 'EUR') {
    return '🇪🇺';
  }
  const match = globalOptions.locales.find((l: Locale) => l.currency === currencyCode);
  return match?.flag || '';
};

const sortedCurrencies: ComputedRef<Option[]> = computed(() => {
  const uniqueCurrencies = Array.from(
    new Set(globalOptions.locales.map((locale: Locale) => locale.currency)),
  ).sort((a, b) => a.localeCompare(b));

  return uniqueCurrencies.map((curr: string) => {
    const flag = getCurrencyFlag(curr);
    return <Option>{
      option: curr,
      label: flag ? `${curr} (${flag})` : curr,
    };
  });
});

const sortedLanguages: ComputedRef<Option[]> = computed(() => {
  const options = globalOptions.locales.map((locale: Locale) => {
    return <Option>{
      option: locale.code,
      label: `${locale.code} (${locale.flag})`,
    };
  });
  return options.sort((a: Option, b: Option) => a.option.localeCompare(b.option));
});

// Sync currency when locale/language changes
watch(() => globalOptions.language, (newLanguage) => {
  const match = globalOptions.locales.find((l: Locale) => l.code === newLanguage);
  if (match) {
    globalOptions.setCurrency(match.currency);
  }
});

const buttonStyle = (flag: boolean): string => (flag ? 'btn-success' : 'btn-error');
const buttonText = (flag: boolean): string => (flag ? constants.BTN_ON : constants.BTN_OFF);
const themeButtonText = (isDark: boolean): string => (isDark ? 'Light' : 'Dark');
</script>

<template>
  <div class="flex flex-col gap-3">
    <!-- Theme & Display Toggles -->
    <div class="bg-base-200/50 rounded-xl p-4 border border-base-content/10 shadow-sm flex flex-col gap-3">
      <div class="flex items-center justify-between gap-2">
        <div>
          <span class="font-bold text-sm text-base-content">Theme Appearance</span>
          <p class="text-xs text-base-content/70 mt-0.5">
            Switch between light (retro) and dark (synthwave) UI color schemes.
          </p>
        </div>
        <base-button
          :class="buttonStyle(globalOptions.darkMode)"
          class="btn-xs sm:btn-sm"
          @click="globalOptions.toggleTheme"
        >
          {{ themeButtonText(globalOptions.darkMode) }}
        </base-button>
      </div>

      <div class="divider my-0 opacity-50" />

      <div class="flex items-center justify-between gap-2">
        <div>
          <span class="font-bold text-sm text-base-content">Periods as Dates</span>
          <p class="text-xs text-base-content/70 mt-0.5">
            Display timeline periods as calendar dates instead of numeric period indices.
          </p>
        </div>
        <base-button
          :class="buttonStyle(globalOptions.periodsAsDates)"
          class="btn-xs sm:btn-sm"
          @click="globalOptions.togglePeriodsAsDates"
        >
          {{ buttonText(globalOptions.periodsAsDates) }}
        </base-button>
      </div>
    </div>

    <!-- Currency & Language Localization -->
    <div class="bg-base-200/50 rounded-xl p-4 border border-base-content/10 shadow-sm flex flex-col gap-3">
      <span class="font-bold text-sm text-base-content">Localization & Formatting</span>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <!-- Currency -->
        <div class="form-control w-full">
          <label class="label py-1">
            <span class="label-text font-semibold text-xs text-base-content">Currency</span>
          </label>
          <select
            :id="`${htmlid.GLOBAL_OPTIONS_ID}-currency`"
            v-model="globalOptions.currency"
            class="select select-bordered select-sm w-full font-mono text-sm bg-base-100/80"
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

        <!-- Language / Locale -->
        <div class="form-control w-full">
          <label class="label py-1">
            <span class="label-text font-semibold text-xs text-base-content">Language & Region</span>
          </label>
          <select
            :id="`${htmlid.GLOBAL_OPTIONS_ID}-language`"
            v-model="globalOptions.language"
            class="select select-bordered select-sm w-full font-mono text-sm bg-base-100/80"
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
      </div>

      <div class="flex flex-wrap gap-2 text-[11px] font-mono text-base-content/60 pt-1">
        <span>Sample: {{ globalOptions.Money(100) }}</span>
        <span>|</span>
        <span>{{ globalOptions.Percent(3.42) }}</span>
        <span>|</span>
        <span>Next: {{ globalOptions.Period(1, true) }}</span>
      </div>
    </div>
  </div>
</template>
