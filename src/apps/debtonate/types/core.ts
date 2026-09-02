import { paymentTypes } from 'moneyfunx';

export type PaymentScenario = {
  paymentAmount: number
  paymentSchedule: paymentTypes.LoansPaymentSchedule
};

export interface UIDebtLoan {
  id: string;
  name: string;
  principal: number;
  annualRate: number;
  periodsPerYear: number;
  termInYears: number;
  periodicRate: number;
  periods: number;
  minPayment: number;
  currentBalance: number;
  fees: number;
}
