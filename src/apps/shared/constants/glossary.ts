export interface GlossaryEntry {
  id: string;
  title: string;
  category: 'debt' | 'investing' | 'shared';
  definition: string;
  formula?: string;
  strategyTip?: string;
}

export const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  // Debtonate (Debt)
  {
    id: 'principal',
    title: 'Principal',
    category: 'debt',
    definition: 'The initial or current amount of money borrowed from a lender, excluding interest charges, fees, and penalties.',
    strategyTip: 'Every dollar paid beyond the minimum payment directly reduces principal, compounding future interest savings.',
  },
  {
    id: 'interestRate',
    title: 'Interest Rate (APR)',
    category: 'debt',
    definition: 'The annualized percentage rate charged by a lender for borrowing funds, before monthly compounding adjustments.',
    formula: 'Monthly Interest = (Current Balance * APR) ÷ 12',
  },
  {
    id: 'effectiveApr',
    title: 'Effective APR',
    category: 'debt',
    definition: 'The overall weighted average annual interest rate across all active debts in your portfolio.',
    formula: 'Effective APR = ∑(Loan Balance_i * APR_i) ÷ Total Debt Balance',
    strategyTip: 'As higher-rate loans are eliminated under the Avalanche method, your portfolio Effective APR drops quickly.',
  },
  {
    id: 'minimumPayment',
    title: 'Minimum Payment',
    category: 'debt',
    definition: 'The lowest monthly dollar amount required by the lender to keep the account current and avoid late penalties or default.',
    strategyTip: 'Paying only minimum payments maximizes total lifetime interest paid and extends payoff duration.',
  },
  {
    id: 'currentBalance',
    title: 'Current Balance',
    category: 'debt',
    definition: 'The remaining unpaid principal owed on a loan at the current point in time.',
  },
  {
    id: 'term',
    title: 'Loan Term',
    category: 'debt',
    definition: 'The scheduled contractual duration (typically in years or months) over which the loan must be fully repaid.',
  },
  {
    id: 'lifetimeInterest',
    title: 'Lifetime Interest',
    category: 'debt',
    definition: 'The cumulative total cost of borrowing paid in interest charges over the entire life of your repayment schedule.',
    strategyTip: 'Increasing your monthly payment budget has a disproportionately huge reduction on lifetime interest.',
  },
  {
    id: 'lifetimePrincipal',
    title: 'Lifetime Principal',
    category: 'debt',
    definition: 'The cumulative amount of actual borrowed funds repaid across all scheduled payment periods.',
  },
  {
    id: 'totalPaid',
    title: 'Total Paid',
    category: 'debt',
    definition: 'The total cash outlay required to extinguish the debt completely, representing principal plus all interest and fees.',
    formula: 'Total Paid = Principal + Lifetime Interest + Fees',
  },
  {
    id: 'amortization',
    title: 'Amortization',
    category: 'debt',
    definition: 'The process of gradually extinguishing debt through regular payments. Early payments are interest-heavy, while later payments shift almost entirely to principal reduction.',
  },
  {
    id: 'snowball',
    title: 'Snowball Method',
    category: 'debt',
    definition: 'A debt repayment strategy where minimum payments are made on all debts while directing any extra budget toward the loan with the lowest balance first.',
    strategyTip: 'Best for motivation: rapid payoff of small balances delivers fast psychological wins that build momentum.',
  },
  {
    id: 'avalanche',
    title: 'Avalanche Method',
    category: 'debt',
    definition: 'A debt repayment strategy where minimum payments are made on all debts while directing any extra budget toward the loan with the highest interest rate first.',
    strategyTip: 'Mathematically optimal: saves the most money and eliminates debt in the shortest calendar time.',
  },
  {
    id: 'reducePayments',
    title: 'Reduce Payments',
    category: 'debt',
    definition: 'An option where eliminating a loan decreases your required monthly budget by that loan\'s minimum payment, rather than rolling the cash into remaining loans.',
    strategyTip: 'When disabled (default), payments "roll over", accelerating payoff of remaining loans like a snowball.',
  },
  {
    id: 'refinancing',
    title: 'Refinancing',
    category: 'debt',
    definition: 'Replacing one or more existing debt obligations with a new loan with different terms, such as a lower interest rate or revised payoff schedule.',
    strategyTip: 'Always check if savings from a lower interest rate outweigh any upfront origination or closing fees.',
  },
  {
    id: 'debtFreeDate',
    title: 'Debt Free Date',
    category: 'debt',
    definition: 'The projected calendar month or period number when all outstanding loan balances reach exactly zero.',
  },

  // Appreciate (Investing)
  {
    id: 'investingBalance',
    title: 'Current Balance (Asset)',
    category: 'investing',
    definition: 'The present market valuation or capital held within an investment instrument or portfolio account.',
  },
  {
    id: 'annualRateReturn',
    title: 'Annual Rate of Return',
    category: 'investing',
    definition: 'The expected yearly percentage rate of growth or capital appreciation generated by an investment instrument.',
  },
  {
    id: 'annualLimit',
    title: 'Annual Contribution Limit',
    category: 'investing',
    definition: 'The legal maximum dollar amount allowed to be deposited into a tax-advantaged retirement account (e.g. 401k, Traditional/Roth IRA, HSA) per calendar tax year.',
    strategyTip: 'Maxing out tax-advantaged accounts protects your compound growth from annual capital gains and dividend taxes.',
  },
  {
    id: 'maxContribution',
    title: 'Max Monthly Contribution',
    category: 'investing',
    definition: 'The exact monthly contribution amount required to hit an account\'s statutory annual limit evenly across 12 months.',
    formula: 'Max Monthly = Annual Limit ÷ 12',
  },
  {
    id: 'lifetimeGrowth',
    title: 'Lifetime Growth (Compound Gains)',
    category: 'investing',
    definition: 'The cumulative investment gains, dividends, and interest generated by your portfolio over the accumulation horizon.',
    strategyTip: 'Due to compound growth, gains will eventually exceed your cumulative out-of-pocket contributions.',
  },
  {
    id: 'lifetimeContribution',
    title: 'Lifetime Contribution',
    category: 'investing',
    definition: 'The total cumulative out-of-pocket capital deposited into your investment instruments over time.',
  },
  {
    id: 'purchasingPower',
    title: 'Purchasing Power (CYM)',
    category: 'investing',
    definition: 'Current Year Money (CYM): Future projected investment balances discounted by inflation to show what goods and services that wealth could buy at today\'s price levels.',
    formula: 'CYM = Future Balance ÷ (1 + Inflation Rate)^Years',
    strategyTip: 'Using CYM provides a realistic assessment of retirement lifestyle rather than illusory nominal numbers.',
  },
  {
    id: 'inflationRate',
    title: 'Inflation Rate',
    category: 'investing',
    definition: 'The annualized rate of general price inflation used to discount future nominal dollars into today\'s real purchasing power.',
  },
  {
    id: 'retirementBalance',
    title: 'Retirement Starting Balance',
    category: 'investing',
    definition: 'The projected total portfolio wealth reached at the transition point between the career accumulation phase and retirement distribution phase.',
  },
  {
    id: 'endingBalance',
    title: 'Ending Balance',
    category: 'investing',
    definition: 'The remaining portfolio capital remaining at the conclusion of the retirement spending horizon.',
    strategyTip: 'An ending balance near zero suggests an efficient portfolio drawdown, while a growing balance indicates a potential legacy inheritance.',
  },
  {
    id: 'drawdown',
    title: 'Drawdown / Withdrawal',
    category: 'investing',
    definition: 'Periodic scheduled cash distributions taken from your accumulated investment portfolio to replace employment income during retirement.',
  },
  {
    id: 'accrueTiming',
    title: 'Accrue Before Contribution',
    category: 'investing',
    definition: 'Calculation timing option: when enabled, portfolio growth is calculated for the month before that period\'s contribution is added.',
  },

  // Shared
  {
    id: 'periodsAsDates',
    title: 'Periods as Dates',
    category: 'shared',
    definition: 'Toggles displaying timeline intervals as real-world calendar dates relative to today instead of generic sequential period numbers (Period 1, Period 2...).',
  },
];

/**
 * Filter glossary entries by search query and/or category
 */
export function filterGlossary(
  entries: GlossaryEntry[],
  search: string,
  category: 'all' | 'debt' | 'investing' | 'shared' = 'all'
): GlossaryEntry[] {
  const query = search.trim().toLowerCase();

  return entries.filter((entry) => {
    const matchesCategory = category === 'all' || entry.category === category;
    if (!matchesCategory) return false;

    if (!query) return true;

    return (
      entry.title.toLowerCase().includes(query) ||
      entry.definition.toLowerCase().includes(query) ||
      (entry.strategyTip && entry.strategyTip.toLowerCase().includes(query)) ||
      (entry.formula && entry.formula.toLowerCase().includes(query))
    );
  });
}
