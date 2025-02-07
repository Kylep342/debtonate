import { LoansPaymentSchedule } from 'moneyfunx';

export type Budget = {
  id: string;
  relative: number;
}

export type MonthlyBudget = {
  id: string;
  relative: number;
  absolute: number;
}

export type PaymentSchedule = {
  paymentAmount: number;
  paymentSchedule: LoansPaymentSchedule;
};
