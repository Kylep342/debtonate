/**
 *
 * *** Global Options Store ***
 *
 * shared store for user-modifiable settings
 *    locale options
 *      currency
 *      language
 *      period/date formatting
 *
 */
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import constants from '@/apps/shared/constants/constants';
import keys from '@/apps/shared/constants/keys';
import { Locale } from '@/apps/shared/types/app';

export default defineStore('globalOptions', () => {
  const baseDate = ref<number>(Date.now()); // TODO: consider letting users modify the base date
  const periodsAsDates = ref<boolean>(false);
  const locales: Array<Locale> = constants.LOCALES;
  const locale: Locale = locales.find((locale: Locale) => locale.code === (navigator.language || 'en-US'));
  const currency = ref<string>(locale.currency);
  const language = ref<string>(locale.code);

  // independent functions/computed values

  // The state functions below are for user-modifiable state only

  /**
   * Resets modifiable state to initial state
   */
  const clearState = (): void => {
    locale.value = locales.find((locale: Locale) => locale.code === (navigator.language || 'en-US'));
    currency.value = locale.currency;
    language.value = locale.code;
    periodsAsDates.value = false;
  };

  /**
   * Loads state from browser Local Storage
   * See keys.ts for naming structure
   */
  const loadState = (): void => {
    currency.value = JSON.parse(localStorage.getItem(keys.LS_CURRENCY)!);
    language.value = JSON.parse(localStorage.getItem(keys.LS_LANGUAGE)!);
    periodsAsDates.value = JSON.parse(
      localStorage.getItem(keys.LS_PERIODS_AS_DATES)!,
    );
  };

  /**
   * Saves state to browser Local Storage
   * see keys.ts for naming structure
   */
  const saveState = (): void => {
    localStorage.setItem(keys.LS_CURRENCY, JSON.stringify(currency.value));
    localStorage.setItem(keys.LS_LANGUAGE, JSON.stringify(language.value));
    localStorage.setItem(
      keys.LS_PERIODS_AS_DATES,
      JSON.stringify(periodsAsDates.value),
    );
  };

  /**
   * Exports state as an in-memory Object
   * @returns {Object} The current state
   */
  const exportState = (): Record<string, any> => ({
    [keys.LS_CURRENCY]: currency.value,
    [keys.LS_LANGUAGE]: language.value,
    [keys.LS_PERIODS_AS_DATES]: periodsAsDates.value,
  });

  // Formatting functions

  /**
   * Formats a number as locale-aware currency
   * @param {number} amount The amount to display
   * @returns {string} The formatted currency of `amount`
   */
  const Money = (amount: number): string => (
    Intl.NumberFormat(
      language.value,
      {
        style: 'currency',
        currency: currency.value,
      },
    ).format(amount)
  );

  /**
   * Formats a number as locale-aware percent
   * @param {number} amount The amount to display
   * @returns {string} the formatted percent of `amount`
   */
  const Percent = (amount: number): string => (
    Intl.NumberFormat(
      language.value,
      {
        style: 'unit',
        unit: 'percent',
        maximumFractionDigits: 2,
      },
    ).format(amount)
  );

  /**
   * Converts an integer period number to a date
   * @param {number[integer]} period The period to convert
   * @param {boolean} asStr Flag to return as a locale-aware string (default=false)
   * @returns {Date | string} The date converted from `period`
   */
  const Period = (period: number, asStr: boolean = false): string|number|Date => {
    if (periodsAsDates.value) {
      const anchorDate = new Date(baseDate.value);
      const relativeDate = new Date(
        anchorDate.getFullYear(),
        anchorDate.getMonth() + period,
        anchorDate.getDate(),
      );
      return asStr ? relativeDate.toLocaleDateString(language.value) : relativeDate;
    }
    return period;
  };

  /** state-aware label for periods in either period or date format */
  const Time = computed<string>(() => periodsAsDates.value ? constants.DATE : constants.PERIOD)

  // Computed values
  const CurrencySymbol = (currency, locale: string): string => {
       const formatted = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(1);

    // Capture only the currency symbol
    const match = formatted.match(/[\p{Sc}]+/u);

    return match ? match[0] : '$';
  }

  // setters

  /**
   * Sets the current currency
   * @param {string} newCurrency browser-standard currency name
   */
  const setCurrency = (newCurrency: string): void => {
    currency.value = newCurrency;
  };

  /**
   * Sets the current language
   * @param {string} newLanguage browser-standard language name
   */
  const setLanguage = (newLanguage: string): void => {
    language.value = newLanguage;
  };

  /**
   * Toggles displaying periods as dates or integers
   */
  const togglePeriodsAsDates = (): void => {
    periodsAsDates.value = !periodsAsDates.value;
  };

  return {
    baseDate,
    clearState,
    currency,
    CurrencySymbol,
    exportState,
    language,
    loadState,
    locales,
    Money,
    Percent,
    Period,
    periodsAsDates,
    saveState,
    setCurrency,
    setLanguage,
    Time,
    togglePeriodsAsDates,
  };
});
