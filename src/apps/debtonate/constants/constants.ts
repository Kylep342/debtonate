import sharedConstants from '@/apps/shared/constants/constants';

//

const BTN_AMORTIZATION_TABLES = "Amortization Tables";
const BTN_DEBTONATE = 'Loans';
const BTN_REFINANCE = 'Refinance';
const BTN_REFINANCING_SUMMARY = "Refinancing Summary";
const BUDGET_DETAILS_ID = 'budgetDetails';
const BUDGET_FORM_ID = 'budgetForm';
const GRAPH_BALANCES_OVER_TIME = 'Balances | Time'
const GRAPH_INTEREST_SAVED_OVER_TIME = 'Interest Saved | Time'
const GRAPH_PAYMENT_BREAKDOWN = 'Payment | Time'
const GRAPH_PERCENT_OF_PAYMENT_AS_PRINCIPAL = 'Percent of Payment as Principal | Time'
const LOAN = 'Loan';
const LOAN_DETAILS_ID = 'loanDetails';
const LOAN_DETAILS = 'Loan Details';
const LOAN_FORM_ID = 'loanForm';
const LOANS = 'Loans';
const NAME_TOTALS_AS_LOAN = 'All Loans';
const OPTIONS_FORM_ID = 'optionsForm';
const PHASE_DEBTONATE = 'Debtonate';
const PHASE_REPATRIATE = 'Repatriate';
const REFINANCING_FORM_ID = 'refinanceForm';
// TK - table keys
const TK_AMOUNT_PAID = 'amountPaid';
const TK_INTEREST_PAID = 'interestPaid';
const TK_PERIOD = 'period';
const TK_PRINCIPAL_PAID = 'principalPaid';
const TK_PRINCIPAL_REMAINING = 'principalRemaining';

export default Object.freeze({
  ...sharedConstants,
  BTN_AMORTIZATION_TABLES,
  BTN_DEBTONATE,
  BTN_REFINANCE,
  BTN_REFINANCING_SUMMARY,
  BUDGET_DETAILS_ID,
  BUDGET_FORM_ID,
  GRAPH_BALANCES_OVER_TIME,
  GRAPH_INTEREST_SAVED_OVER_TIME,
  GRAPH_PAYMENT_BREAKDOWN,
  GRAPH_PERCENT_OF_PAYMENT_AS_PRINCIPAL,
  LOAN_DETAILS_ID,
  LOAN_DETAILS,
  LOAN_FORM_ID,
  LOAN,
  LOANS,
  NAME_TOTALS_AS_LOAN,
  OPTIONS_FORM_ID,
  PHASE_DEBTONATE,
  PHASE_REPATRIATE,
  REFINANCING_FORM_ID,
  TK_AMOUNT_PAID,
  TK_INTEREST_PAID,
  TK_PERIOD,
  TK_PRINCIPAL_PAID,
  TK_PRINCIPAL_REMAINING,
});
