import { LoansPaymentSchedule } from 'moneyfunx';

<<<<<<< HEAD
export type Budget = {
  id: string;
  relative: number;
}

=======
>>>>>>> main
export type MonthlyBudget = {
  id: string;
  relative: number;
  absolute: number;
}

export type PaymentSchedule = {
  paymentAmount: number;
  paymentSchedule: LoansPaymentSchedule;
};
