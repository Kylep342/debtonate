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

export default defineStore('globalOptions', () => {
  const baseDate = ref<number>(Date.now()); // TODO: consider letting users modify the base date
  const currencies: Array<string> = [...new Set(Object.values(constants.LOCALE_CURRENCY))];
  const currency = ref<string>(constants.LOCALE_CURRENCY[navigator.language] || 'USD');
  const language = ref<string>(navigator.language);
  const languages: Array<string> = [...new Set(Object.keys(constants.LOCALE_CURRENCY))];
  const periodsAsDates = ref<boolean>(false);

  // independent functions/computed values

  // The state functions below are for user-modifiable state only

  /**
   * Resets modifiable state to initial state
   */
  const clearState = (): void => {
    currency.value = constants.LOCALE_CURRENCY[navigator.language];
    language.value = navigator.language;
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

  /**
   * Returns the current currency symbol
   * defaults to '$'
   */
  const currencySymbol = computed<string>(() => {
    // fixed to a style that leads with a symbol
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.value,
    }).format(1);

    // Capture only the currency symbol
    const match = formatted.match(/[\p{Sc}]+/u);

    return match ? match[0] : '$';
  });

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
    currencies,
    currency,
    currencySymbol,
    exportState,
    language,
    languages,
    loadState,
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
