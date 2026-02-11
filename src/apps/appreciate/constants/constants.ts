import { constants } from 'moneyfunx';

import sharedConstants from '@/apps/shared/constants/constants';

//

const BUDGET_DETAILS_ID = 'appreciateBudgetDetails';
const DEFAULT_INFLATION_FACTOR = 3;
const DEFAULT_YEARS_TO_CONTRIBUTE = 25;
const DEFAULT_YEARS_TO_SPEND = 40;
const GRAPH_BALANCES_OVER_TIME = 'Balances | Time';
const GRAPH_GROWTH_CONTRIBUTION_RATIO_OVER_TIME = 'Growth/Contribution | Time';
const GRAPH_PURCHASING_POWER_OVER_TIME = 'Purchasing Power | Time';
const INSTRUMENT_DETAILS_ID = 'instrumentDetails';
const INSTRUMENT_DETAILS = 'Instrument Details';
const INSTRUMENT_FORM_ID = 'instrumentForm';
const INSTRUMENTS = 'Instruments';
const MAX_DELTA_FACTOR = 30; // used for both growth and inflation
const MAX_DURATION_YEARS = constants.MAX_DURATION_YEARS;
const NAME_TOTALS_AS_AN_INSTRUMENT = 'All Instruments';
const OPTIONS_FORM_ID = 'appreciateOptionsForm';

export default Object.freeze({
  ...sharedConstants,
  BUDGET_DETAILS_ID,
  DEFAULT_INFLATION_FACTOR,
  DEFAULT_YEARS_TO_CONTRIBUTE,
  DEFAULT_YEARS_TO_SPEND,
  GRAPH_BALANCES_OVER_TIME,
  GRAPH_GROWTH_CONTRIBUTION_RATIO_OVER_TIME,
  GRAPH_PURCHASING_POWER_OVER_TIME,
  INSTRUMENT_DETAILS_ID,
  INSTRUMENT_DETAILS,
  INSTRUMENT_FORM_ID,
  INSTRUMENTS,
  MAX_DURATION_YEARS,
  MAX_DELTA_FACTOR,
  NAME_TOTALS_AS_AN_INSTRUMENT,
  OPTIONS_FORM_ID,
});
