import {
  ILoan,
  LoansPaymentSchedule
} from 'moneyfunx';

export type MonthlyBudget = {
  id: string;
  relative: number;
  absolute: number;
}

export type PaymentSchedule = {
  paymentAmount: number;
  paymentSchedule: LoansPaymentSchedule;
};

export type RefinancingScenarios = Record<string, ILoan[]>;
