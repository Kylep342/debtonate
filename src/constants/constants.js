import { TOTALS } from 'moneyfunx';

const BTN_CLEAR = 'Clear';
const BTN_CREATE = 'Create';
const BTN_DELETE = 'Delete';
const BTN_DETAILS = 'Details';
const BTN_EDIT = 'Edit';
const BTN_EXPORT = 'Export';
const BTN_LOAD = 'Load';
const BTN_MENU = 'Menu';
const BTN_OFF = 'Off';
const BTN_ON = 'On';
const BTN_OPTIONS = 'Options';
const BTN_REFINANCE = 'Refinance';
const BTN_SAVE = 'Save';
const BTN_SELECT = 'Select';
const BUG_FORM_LINK = "https://forms.gle/5hdgxA4jKGQA5U8J9"
const BUDGET = 'Budget';
const BUDGET_DETAILS_ID = 'budgetDetails';
const BUDGET_DETAILS = 'Budget Details';
const BUDGET_FORM_ID = 'budgetForm';
const BUDGETS = 'Budgets';
const COLORS = [
  'oklch(80.74% 0.0525 159.09)',
  'oklch(76.87% 0.1041 22.66)',
  'oklch(70.39% 0.1255 52.95)',
  'oklch(28.42% 0.0095 355.53)'
];
const DEFAULT = 'default';
const GRAPH_BALANCES_OVER_TIME = 'Balances | Time'
const GRAPH_INTEREST_SAVED_OVER_TIME = 'Interest Saved | Time'
const GRAPH_PERCENT_OF_PAYMENT_TO_PRINCIPAL = 'Percent of Payment to Principal | Time'
const GRAPHS = 'Graphs';
const LOAN = 'Loan';
const LOAN_DETAILS_ID = 'loanDetails';
const LOAN_DETAILS = 'Loan Details';
const LOAN_FORM_ID = 'loanForm';
const LOANS = 'Loans';
const NAME_MIN_BUDGET = 'Minimum Budget';
const NAME_TOTALS_AS_LOAN = 'All Loans';
const OPTIONS_FORM_ID = 'optionsForm';
const REFINANCING_FORM_ID = 'refinanceForm';
const TABLES = 'Tables';

const LOCALE_CURRENCY = {
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
  BTN_CLEAR,
  BTN_CREATE,
  BTN_DELETE,
  BTN_DETAILS,
  BTN_EDIT,
  BTN_EXPORT,
  BTN_LOAD,
  BTN_MENU,
  BTN_OFF,
  BTN_ON,
  BTN_OPTIONS,
  BTN_REFINANCE,
  BTN_SAVE,
  BTN_SELECT,
  BUDGET_DETAILS_ID,
  BUDGET_DETAILS,
  BUDGET_FORM_ID,
  BUDGET,
  BUDGETS,
  BUG_FORM_LINK,
  COLORS,
  DEFAULT,
  GRAPH_BALANCES_OVER_TIME,
  GRAPH_INTEREST_SAVED_OVER_TIME,
  GRAPH_PERCENT_OF_PAYMENT_TO_PRINCIPAL,
  GRAPHS,
  LOAN_DETAILS_ID,
  LOAN_DETAILS,
  LOAN_FORM_ID,
  LOAN,
  LOANS,
  LOCALE_CURRENCY,
  NAME_MIN_BUDGET,
  NAME_TOTALS_AS_LOAN,
  OPTIONS_FORM_ID,
  REFINANCING_FORM_ID,
  TABLES,
  TOTALS,
});
