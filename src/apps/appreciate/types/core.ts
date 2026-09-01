import { contributionTypes } from 'moneyfunx';

export type ContributionScenario = {
  contributionAmount: number
  contributionSchedule: contributionTypes.InstrumentsContributionSchedule
};

export interface UIInstrument {
  id: string;
  name: string;
  currentBalance: number;
  annualRate: number;
  periodsPerYear: number;
  periodicRate: number;
  annualLimit: number;
}
