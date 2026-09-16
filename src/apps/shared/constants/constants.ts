/**
 * Shared constants across apps
 *
 * buttons
 * colors
 * locales
 * cross-app keywords
 */
import { constants } from 'moneyfunx';

import { Locale } from '@/apps/shared/types/app';

// Buttons
const BTN_CLEAR = 'Clear';
const BTN_COPY = 'Copy';
const BTN_CREATE = 'Create';
const BTN_DELETE = 'Delete';
const BTN_DETAILS = 'Details';
const BTN_EDIT = 'Edit';
const BTN_GLOSSARY = 'Glossary & Guide';
const BTN_LOAD = 'Load';
const BTN_MENU = 'Menu';
const BTN_OFF = 'Off';
const BTN_ON = 'On';
const BTN_OPTIONS = 'Options';
const BTN_PIVOT = 'Pivot';
const BTN_REFINANCE = 'Refinancing';
const BTN_SAVE = 'Save';
const BTN_SELECT = 'Select';
const BTN_SHARE_EXPORT = 'Share & Export';

// Budgets
const BUDGET = 'Budget';
const BUDGET_DETAILS = 'Budget Details';
const BUDGET_FORM_ID = 'budgetForm'
const BUDGETS = 'Budgets';

// User feedback Google form
const BUG_FORM_LINK = "https://forms.gle/5hdgxA4jKGQA5U8J9"

// App color scheme
const COLOR_PALETTE = [
  'oklch(var(--s))',
  'oklch(var(--p))',
  'oklch(var(--a))',
  'oklch(var(--bc))'
];

const DATE = 'Date'
const DEFAULT = 'default';
const GLOSSARY_MODAL_ID = 'glossaryModal';
const GLOSSARY_MODAL_TITLE = 'Financial Glossary & Guide';
const SHARE_EXPORT_MODAL_ID = 'shareExportModal';
const SHARE_EXPORT_MODAL_TITLE = 'Share & Export Plan';
const GRAPHS = 'Graphs';

// Internationalization metadata
//  for formatting money, percents, dates
const LOCALES: Locale[] = [
  { code: 'ar-AE', currency: 'AED', flag: '🇦🇪' }, // UAE Dirham
  { code: 'ar-EG', currency: 'EGP', flag: '🇪🇬' }, // Egyptian Pound
  { code: 'ar-KW', currency: 'KWD', flag: '🇰🇼' }, // Kuwaiti Dinar
  { code: 'ar-MA', currency: 'MAD', flag: '🇲🇦' }, // Moroccan Dirham
  { code: 'ar-QA', currency: 'QAR', flag: '🇶🇦' }, // Qatari Rial
  { code: 'ar-SA', currency: 'SAR', flag: '🇸🇦' }, // Saudi Riyal
  { code: 'bg-BG', currency: 'BGN', flag: '🇧🇬' }, // Bulgarian Lev
  { code: 'bn-BD', currency: 'BDT', flag: '🇧🇩' }, // Bangladeshi Taka
  { code: 'cs-CZ', currency: 'CZK', flag: '🇨🇿' }, // Czech Koruna
  { code: 'da-DK', currency: 'DKK', flag: '🇩🇰' }, // Danish Krone
  { code: 'de-AT', currency: 'EUR', flag: '🇦🇹' }, // Euro (Austria)
  { code: 'de-CH', currency: 'CHF', flag: '🇨🇭' }, // Swiss Franc
  { code: 'de-DE', currency: 'EUR', flag: '🇩🇪' }, // Euro (Germany)
  { code: 'el-GR', currency: 'EUR', flag: '🇬🇷' }, // Euro (Greece)
  { code: 'en-AU', currency: 'AUD', flag: '🇦🇺' }, // Australian Dollar
  { code: 'en-CA', currency: 'CAD', flag: '🇨🇦' }, // Canadian Dollar
  { code: 'en-GB', currency: 'GBP', flag: '🇬🇧' }, // British Pound Sterling
  { code: 'en-GH', currency: 'GHS', flag: '🇬🇭' }, // Ghanaian Cedi
  { code: 'en-IE', currency: 'EUR', flag: '🇮🇪' }, // Euro (Ireland)
  { code: 'en-KE', currency: 'KES', flag: '🇰🇪' }, // Kenyan Shilling
  { code: 'en-NG', currency: 'NGN', flag: '🇳🇬' }, // Nigerian Naira
  { code: 'en-NZ', currency: 'NZD', flag: '🇳🇿' }, // New Zealand Dollar
  { code: 'en-PH', currency: 'PHP', flag: '🇵🇭' }, // Philippine Peso
  { code: 'en-SG', currency: 'SGD', flag: '🇸🇬' }, // Singapore Dollar
  { code: 'en-US', currency: 'USD', flag: '🇺🇸' }, // United States Dollar
  { code: 'en-ZA', currency: 'ZAR', flag: '🇿🇦' }, // South African Rand
  { code: 'es-AR', currency: 'ARS', flag: '🇦🇷' }, // Argentine Peso
  { code: 'es-CL', currency: 'CLP', flag: '🇨🇱' }, // Chilean Peso
  { code: 'es-CO', currency: 'COP', flag: '🇨🇴' }, // Colombian Peso
  { code: 'es-CR', currency: 'CRC', flag: '🇨🇷' }, // Costa Rican Colón
  { code: 'es-DO', currency: 'DOP', flag: '🇩🇴' }, // Dominican Peso
  { code: 'es-ES', currency: 'EUR', flag: '🇪🇸' }, // Euro (Spain)
  { code: 'es-GT', currency: 'GTQ', flag: '🇬🇹' }, // Guatemalan Quetzal
  { code: 'es-MX', currency: 'MXN', flag: '🇲🇽' }, // Mexican Peso
  { code: 'es-PA', currency: 'PAB', flag: '🇵🇦' }, // Panamanian Balboa
  { code: 'es-PE', currency: 'PEN', flag: '🇵🇪' }, // Peruvian Sol
  { code: 'es-UY', currency: 'UYU', flag: '🇺🇾' }, // Uruguayan Peso
  { code: 'es-VE', currency: 'VES', flag: '🇻🇪' }, // Venezuelan Bolívar
  { code: 'fi-FI', currency: 'EUR', flag: '🇫🇮' }, // Euro (Finland)
  { code: 'fr-CA', currency: 'CAD', flag: '🇨🇦' }, // Canadian Dollar (French)
  { code: 'fr-FR', currency: 'EUR', flag: '🇫🇷' }, // Euro (France)
  { code: 'he-IL', currency: 'ILS', flag: '🇮🇱' }, // Israeli New Shekel
  { code: 'hi-IN', currency: 'INR', flag: '🇮🇳' }, // Indian Rupee
  { code: 'hu-HU', currency: 'HUF', flag: '🇭🇺' }, // Hungarian Forint
  { code: 'id-ID', currency: 'IDR', flag: '🇮🇩' }, // Indonesian Rupiah
  { code: 'is-IS', currency: 'ISK', flag: '🇮🇸' }, // Icelandic Króna
  { code: 'it-IT', currency: 'EUR', flag: '🇮🇹' }, // Euro (Italy)
  { code: 'ja-JP', currency: 'JPY', flag: '🇯🇵' }, // Japanese Yen
  { code: 'ko-KR', currency: 'KRW', flag: '🇰🇷' }, // South Korean Won
  { code: 'ms-MY', currency: 'MYR', flag: '🇲🇾' }, // Malaysian Ringgit
  { code: 'nl-NL', currency: 'EUR', flag: '🇳🇱' }, // Euro (Netherlands)
  { code: 'no-NO', currency: 'NOK', flag: '🇳🇴' }, // Norwegian Krone
  { code: 'pl-PL', currency: 'PLN', flag: '🇵🇱' }, // Polish Złoty
  { code: 'pt-BR', currency: 'BRL', flag: '🇧🇷' }, // Brazilian Real
  { code: 'pt-PT', currency: 'EUR', flag: '🇵🇹' }, // Euro (Portugal)
  { code: 'ro-RO', currency: 'RON', flag: '🇷🇴' }, // Romanian Leu
  { code: 'ru-RU', currency: 'RUB', flag: '🇷🇺' }, // Russian Ruble
  { code: 'sv-SE', currency: 'SEK', flag: '🇸🇪' }, // Swedish Krona
  { code: 'th-TH', currency: 'THB', flag: '🇹🇭' }, // Thai Baht
  { code: 'tr-TR', currency: 'TRY', flag: '🇹🇷' }, // Turkish Lira
  { code: 'uk-UA', currency: 'UAH', flag: '🇺🇦' }, // Ukrainian Hryvnia
  { code: 'ur-PK', currency: 'PKR', flag: '🇵🇰' }, // Pakistani Rupee
  { code: 'vi-VN', currency: 'VND', flag: '🇻🇳' }, // Vietnamese Dong
  { code: 'zh-CN', currency: 'CNY', flag: '🇨🇳' }, // Chinese Yuan
  { code: 'zh-HK', currency: 'HKD', flag: '🇭🇰' }, // Hong Kong Dollar
  { code: 'zh-TW', currency: 'TWD', flag: '🇹🇼' }, // New Taiwan Dollar
];

const NAME_APPRECIATE = 'Appreciate';
const NAME_DEBTONATE = 'Debtonate';
const NAME_MIN_BUDGET = 'Minimum Budget';
const PERIOD = 'Period';
const PERIODS_PER_YEAR = 12;

// phase toggles
const PT_CAREER = 'Career'; // appreciate
const PT_CURRENT_DEBT = 'Current Debt'; // debtonate
const PT_REFINANCING = 'Refinancing'; // repatriate
const PT_RETIREMENT = 'Retirement'; // investigate

const TABLES = 'Tables';
const THEME = 'retro';
const THEME_DARK = 'synthwave';

export default Object.freeze({
  BTN_CLEAR,
  BTN_COPY,
  BTN_CREATE,
  BTN_DELETE,
  BTN_DETAILS,
  BTN_EDIT,
  BTN_GLOSSARY,
  BTN_LOAD,
  BTN_MENU,
  BTN_OFF,
  BTN_ON,
  BTN_OPTIONS,
  BTN_PIVOT,
  BTN_REFINANCE,
  BTN_SAVE,
  BTN_SELECT,
  BTN_SHARE_EXPORT,
  BUDGET,
  BUDGET_DETAILS,
  BUDGET_FORM_ID,
  BUDGETS,
  BUG_FORM_LINK,
  COLOR_PALETTE,
  DATE,
  DEFAULT,
  GLOSSARY_MODAL_ID,
  GLOSSARY_MODAL_TITLE,
  GRAPHS,
  LOCALES,
  NAME_APPRECIATE,
  NAME_DEBTONATE,
  NAME_MIN_BUDGET,
  PERIOD,
  PERIODS_PER_YEAR,
  PT_CAREER,
  PT_CURRENT_DEBT,
  PT_REFINANCING,
  PT_RETIREMENT,
  SHARE_EXPORT_MODAL_ID,
  SHARE_EXPORT_MODAL_TITLE,
  TABLES,
  THEME,
  THEME_DARK,
  ...constants,
});
