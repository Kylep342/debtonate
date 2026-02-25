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
import { computed, ref, ComputedRef, Ref } from 'vue';

import { useTheme } from '@/apps/shared/composables/useTheme';
import constants from '@/apps/shared/constants/constants';
import keys from '@/apps/shared/constants/keys';
import { Locale } from '@/apps/shared/types/app';


// --- Types --- //

type CurrencyCode = (typeof constants.LOCALES)[number]['currency'];
type LanguageCode = (typeof constants.LOCALES)[number]['code'];

export interface GlobalOptionsState {
  baseDate: Ref<number>;
  colorPalate: ComputedRef<string[]>;
  currency: Ref<CurrencyCode>;
  darkMode: Ref<boolean>;
  language: Ref<LanguageCode>;
  locales: Locale[];
  periodsAsDates: Ref<boolean>;
};

export interface GlobalOptionsGetters {
  /** State-aware label for periods in either period or date format */
  Time: ComputedRef<string>;
};

export interface GlobalOptionsActions {
  clearState: () => void;
  CurrencySymbol: (currency: CurrencyCode, localeCode: LanguageCode) => string;
  exportState: () => Record<string, string | boolean>;
  loadState: () => void;
  Money: (amount: number) => string;
  Percent: (amount: number) => string;
  Period: (period: number, asStr?: boolean) => string | number | Date;
  saveState: () => void;
  setCurrency: (newCurrency: CurrencyCode) => void;
  setLanguage: (newLanguage: LanguageCode) => void;
  togglePeriodsAsDates: () => void;
  toggleTheme: () => void;
};

// --- Store --- //

export const useGlobalOptionsStore = defineStore('globalOptions', () => {

  /** STATE */

  const baseDate: Ref<number> = ref(Date.now()); // TODO: consider letting users modify the base date
  const periodsAsDates: Ref<boolean> = ref(false);
  const locales: Locale[] = constants.LOCALES;
  const defaultLocale: Locale = locales.find((locale: Locale) => locale.code === (navigator.language || 'en-US'));
  const currency: Ref<CurrencyCode> = ref(defaultLocale.currency);
  const language: Ref<LanguageCode> = ref(defaultLocale.code);


  /** COMPOSABLES */

  const { darkMode, colorPalate, toggleTheme } = useTheme();

  /** ACTIONS */

  // state management

  const clearState = (): void => {
    currency.value = defaultLocale.currency;
    language.value = defaultLocale.code;
    periodsAsDates.value = false;
  };

  /**
   * Loads state from browser Local Storage
   * See keys.ts for naming structure
   */
  const loadState = (): void => {
    const storedCurrency = localStorage.getItem(keys.LS_CURRENCY);
    const storedLanguage = localStorage.getItem(keys.LS_LANGUAGE);
    const storedPeriodsAsDates = localStorage.getItem(keys.LS_PERIODS_AS_DATES);

    if (storedCurrency) currency.value = JSON.parse(localStorage.getItem(keys.LS_CURRENCY)!);
    if (storedLanguage) language.value = JSON.parse(localStorage.getItem(keys.LS_LANGUAGE)!);
    if (storedPeriodsAsDates) periodsAsDates.value = JSON.parse(
      localStorage.getItem(keys.LS_PERIODS_AS_DATES)!,
    );
  };

  /**
   * Saves state to browser Local Storage
   * see keys.ts for naming structure
   */
  const saveState = (): void => {
    localStorage.setItem(keys.LS_CURRENCY, JSON.stringify(currency.value));
    // localStorage.setItem(keys.LS_THEME, JSON.stringify(darkMode.value));
    localStorage.setItem(keys.LS_LANGUAGE, JSON.stringify(language.value));
    localStorage.setItem(
      keys.LS_PERIODS_AS_DATES,
      JSON.stringify(periodsAsDates.value),
    );
  };

  /**
   * Exports state as an in-memory Object
   * @returns {Object} The current user-modifiable state
   */
  const exportState = (): Record<string, any> => ({
    [keys.LS_CURRENCY]: currency.value,
    // [keys.LS_THEME]: darkMode.value,
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
   * Converts an integer period number to a date or formats an existing date
   * @param {number | Date} period The period to convert or the date to format
   * @param {boolean} asStr Flag to return as a locale-aware string (default=false)
   * @returns {Date | string | number} The date or period converted from `period`
   */
  const Period = (period: number | Date, asStr: boolean = false): string | number | Date => {
    if (period instanceof Date) {
      return asStr ? period.toLocaleDateString(language.value) : period;
    }

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

/**
 * Returns the symbol for a provided currency and locale code
 * @param {CurrencyCode} currency browser-standard currency name
 * @param {LanguageCode} localeCode browser-standard language name
 * @returns {string} the formatted currency symbol or '$'
 */
  const CurrencySymbol = (currency: CurrencyCode, localeCode: LanguageCode): string => {
       const formatted = new Intl.NumberFormat(localeCode, {
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
   * @param {CurrencyCode} newCurrency browser-standard currency name
   */
  const setCurrency = (newCurrency: CurrencyCode): void => {
    currency.value = newCurrency;
  };

  /**
   * Sets the current language
   * @param {LanguageCode} newLanguage browser-standard language name
   */
  const setLanguage = (newLanguage: LanguageCode): void => {
    language.value = newLanguage;
  };

  /**
   * Toggles displaying periods as dates or integers
   */
  const togglePeriodsAsDates = (): void => {
    periodsAsDates.value = !periodsAsDates.value;
  };

  /** GETTERS */

  /** state-aware label for periods in either period or date format */
  const Time: ComputedRef<string> = computed(() => periodsAsDates.value ? constants.DATE : constants.PERIOD)


  return {
    baseDate,
    clearState,
    colorPalate,
    currency,
    CurrencySymbol,
    darkMode,
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
    toggleTheme,
  };
});

export type GlobalOptionsStore = ReturnType<typeof useGlobalOptionsStore>;
