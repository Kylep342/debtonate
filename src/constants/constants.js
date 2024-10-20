import { TOTALS } from 'moneyfunx';

const BTN_CREATE = 'Create';
const BTN_OFF = 'Off';
const BTN_ON = 'On';
const BTN_SAVE = 'Save';
const BUDGET = 'Budget';
const BUDGET_DETAILS_ID = 'budgetDetails';
const BUDGET_DETAILS = 'Budget Details';
const BUDGET_FORM_ID = 'budgetForm';
const BUDGETS = 'Budgets';
const COLORS = ['#DAF7A6', '#900C3F', '#C70039', '#581845', '#FF5733', '#FFC300'];
const DEFAULT = 'default';
const LOAN = 'Loan';
const LOAN_DETAILS_ID = 'loanDetails';
const LOAN_DETAILS = 'Loan Details';
const LOAN_FORM_ID = 'loanForm';
const LOANS = 'Loans';
const NAME_MIN_BUDGET = 'Minimum Budget';
const NAME_TOTALS_AS_LOAN = 'All Loans';
const OPTIONS_FORM_ID = 'optionsForm';

const LOCALE_CURRENY = {
  // North America
  'en-US': 'USD', // United States Dollar
  'en-CA': 'CAD', // Canadian Dollar
  'fr-CA': 'CAD', // Canadian Dollar (French)
  'es-MX': 'MXN', // Mexican Peso

  // Europe
  'en-GB': 'GBP', // British Pound Sterling
  'fr-FR': 'EUR', // Euro (France)
  'de-DE': 'EUR', // Euro (Germany)
  'it-IT': 'EUR', // Euro (Italy)
  'es-ES': 'EUR', // Euro (Spain)
  'pt-PT': 'EUR', // Euro (Portugal)
  'nl-NL': 'EUR', // Euro (Netherlands)
  'pl-PL': 'PLN', // Polish Złoty
  'sv-SE': 'SEK', // Swedish Krona
  'da-DK': 'DKK', // Danish Krone
  'fi-FI': 'EUR', // Euro (Finland)
  'no-NO': 'NOK', // Norwegian Krone
  'cs-CZ': 'CZK', // Czech Koruna
  'hu-HU': 'HUF', // Hungarian Forint
  'ro-RO': 'RON', // Romanian Leu
  'bg-BG': 'BGN', // Bulgarian Lev
  'ru-RU': 'RUB', // Russian Ruble
  'uk-UA': 'UAH', // Ukrainian Hryvnia

  // Middle East & Africa
  'ar-EG': 'EGP', // Egyptian Pound
  'ar-SA': 'SAR', // Saudi Riyal
  'he-IL': 'ILS', // Israeli New Shekel
  'ar-AE': 'AED', // UAE Dirham
  'en-ZA': 'ZAR', // South African Rand
  'en-NG': 'NGN', // Nigerian Naira

  // Asia
  'ja-JP': 'JPY', // Japanese Yen
  'zh-CN': 'CNY', // Chinese Yuan
  'zh-HK': 'HKD', // Hong Kong Dollar
  'zh-TW': 'TWD', // New Taiwan Dollar
  'ko-KR': 'KRW', // South Korean Won
  'hi-IN': 'INR', // Indian Rupee
  'th-TH': 'THB', // Thai Baht
  'vi-VN': 'VND', // Vietnamese Dong
  'id-ID': 'IDR', // Indonesian Rupiah
  'ms-MY': 'MYR', // Malaysian Ringgit
  'en-SG': 'SGD', // Singapore Dollar

  // Oceania
  'en-AU': 'AUD', // Australian Dollar
  'en-NZ': 'NZD', // New Zealand Dollar

  // South America
  'pt-BR': 'BRL', // Brazilian Real
  'es-AR': 'ARS', // Argentine Peso
  'es-CL': 'CLP', // Chilean Peso
  'es-CO': 'COP', // Colombian Peso
  'es-PE': 'PEN', // Peruvian Sol
  'es-VE': 'VES', // Venezuelan Bolívar
  'es-UY': 'UYU', // Uruguayan Peso
};

export default Object.freeze({
  BTN_CREATE,
  BTN_OFF,
  BTN_ON,
  BTN_SAVE,
  BUDGET_DETAILS_ID,
  BUDGET_DETAILS,
  BUDGET_FORM_ID,
  BUDGET,
  BUDGETS,
  COLORS,
  DEFAULT,
  LOAN_DETAILS_ID,
  LOAN_DETAILS,
  LOAN_FORM_ID,
  LOAN,
  LOANS,
  LOCALE_CURRENY,
  NAME_MIN_BUDGET,
  NAME_TOTALS_AS_LOAN,
  OPTIONS_FORM_ID,
  TOTALS,
});
