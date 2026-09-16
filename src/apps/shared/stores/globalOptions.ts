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
  colorPalette: ComputedRef<string[]>;
  currency: Ref<CurrencyCode>;
  darkMode: Ref<boolean>;
  isGlossaryActive: Ref<boolean>;
  isShareExportActive: Ref<boolean>;
  language: Ref<LanguageCode>;
  locales: Locale[];
  periodsAsDates: Ref<boolean>;
}

export interface GlobalOptionsGetters {
  /** State-aware label for periods in either period or date format */
  Time: ComputedRef<string>;
}

export interface GlobalOptionsActions {
  clearState: () => void;
  closeGlossary: () => void;
  closeShareExport: () => void;
  CurrencySymbol: (currency: CurrencyCode, localeCode: LanguageCode) => string;
  exportState: () => Record<string, string | boolean>;
  importState: (data: Record<string, any>) => void;
  loadState: () => void;
  Money: (amount: number | bigint) => string;
  openGlossary: () => void;
  openShareExport: () => void;
  Percent: (amount: number | bigint) => string;
  Period: (period: number | Date, asStr?: boolean) => string | number | Date;
  saveState: () => void;
  setCurrency: (newCurrency: CurrencyCode) => void;
  setLanguage: (newLanguage: LanguageCode) => void;
  toggleGlossary: () => void;
  togglePeriodsAsDates: () => void;
  toggleShareExport: () => void;
  toggleTheme: () => void;
}

// --- Store --- //

export const useGlobalOptionsStore = defineStore('globalOptions', () => {

  /** STATE */

  const baseDate: Ref<number> = ref(Date.now()); // TODO: consider letting users modify the base date
  const periodsAsDates: Ref<boolean> = ref(false);
  const isGlossaryActive: Ref<boolean> = ref(false);
  const isShareExportActive: Ref<boolean> = ref(false);
  const locales: Locale[] = constants.LOCALES;
  const defaultLocale: Locale = locales.find((locale: Locale) => locale.code === navigator.language)
    || locales.find((locale: Locale) => locale.code === 'en-US')
    || locales[0];
  const currency: Ref<CurrencyCode> = ref(defaultLocale.currency);
  const language: Ref<LanguageCode> = ref(defaultLocale.code);


  /** COMPOSABLES */

  const { darkMode, colorPalette, toggleTheme } = useTheme();

  /** ACTIONS */

  // state management

  const clearState = (): void => {
    currency.value = defaultLocale.currency;
    language.value = defaultLocale.code;
    periodsAsDates.value = false;
    isGlossaryActive.value = false;
    isShareExportActive.value = false;
  };

  /**
   * Imports state from an object (e.g. from local storage, URL hash, or file)
   */
  const importState = (data: Record<string, any>): void => {
    if (data[keys.LS_CURRENCY] !== undefined) currency.value = data[keys.LS_CURRENCY];
    if (data[keys.LS_LANGUAGE] !== undefined) language.value = data[keys.LS_LANGUAGE];
    if (data[keys.LS_PERIODS_AS_DATES] !== undefined) {
      periodsAsDates.value = Boolean(data[keys.LS_PERIODS_AS_DATES]);
    }
  };

  /**
   * Loads state from browser Local Storage
   * See keys.ts for naming structure
   */
  const loadState = (): void => {
    const data: Record<string, any> = {};
    const storedCurrency = localStorage.getItem(keys.LS_CURRENCY);
    const storedLanguage = localStorage.getItem(keys.LS_LANGUAGE);
    const storedPeriodsAsDates = localStorage.getItem(keys.LS_PERIODS_AS_DATES);

    if (storedCurrency) data[keys.LS_CURRENCY] = JSON.parse(storedCurrency);
    if (storedLanguage) data[keys.LS_LANGUAGE] = JSON.parse(storedLanguage);
    if (storedPeriodsAsDates) data[keys.LS_PERIODS_AS_DATES] = JSON.parse(storedPeriodsAsDates);

    importState(data);
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
   * @param {number | bigint} amount The amount to display
   * @returns {string} The formatted currency of `amount`
   */
  const Money = (amount: number | bigint): string => (
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
   * @param {number | bigint} amount The amount to display
   * @returns {string} the formatted percent of `amount`
   */
  const Percent = (amount: number | bigint): string => (
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

  /**
   * Opens the financial glossary modal
   */
  const openGlossary = (): void => {
    isGlossaryActive.value = true;
  };

  /**
   * Closes the financial glossary modal
   */
  const closeGlossary = (): void => {
    isGlossaryActive.value = false;
  };

  /**
   * Toggles the financial glossary modal
   */
  const toggleGlossary = (): void => {
    isGlossaryActive.value = !isGlossaryActive.value;
  };

  /**
   * Opens the share & export modal
   */
  const openShareExport = (): void => {
    isShareExportActive.value = true;
  };

  /**
   * Closes the share & export modal
   */
  const closeShareExport = (): void => {
    isShareExportActive.value = false;
  };

  /**
   * Toggles the share & export modal
   */
  const toggleShareExport = (): void => {
    isShareExportActive.value = !isShareExportActive.value;
  };

  /** GETTERS */

  /** state-aware label for periods in either period or date format */
  const Time: ComputedRef<string> = computed(() => periodsAsDates.value ? constants.DATE : constants.PERIOD)


  return {
    baseDate,
    clearState,
    closeGlossary,
    closeShareExport,
    colorPalette,
    currency,
    CurrencySymbol,
    darkMode,
    exportState,
    importState,
    isGlossaryActive,
    isShareExportActive,
    language,
    loadState,
    locales,
    Money,
    openGlossary,
    openShareExport,
    Percent,
    Period,
    periodsAsDates,
    saveState,
    setCurrency,
    setLanguage,
    Time,
    toggleGlossary,
    togglePeriodsAsDates,
    toggleShareExport,
    toggleTheme,
  };
});

export type GlobalOptionsStore = ReturnType<typeof useGlobalOptionsStore>;
