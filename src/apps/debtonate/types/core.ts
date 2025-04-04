import { LoansPaymentSchedule } from 'moneyfunx';

export type Budget = {
  id: string
  relative: number
};

export type MonthlyBudget = {
  id: string
  relative: number
  absolute: number
};

export type PaymentScenario = {
  paymentAmount: number
  paymentSchedule: LoansPaymentSchedule
};
