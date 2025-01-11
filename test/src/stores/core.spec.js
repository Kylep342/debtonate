import { Loan } from "moneyfunx";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import useCoreStore from 'src/stores/core';
import constants from 'src/constants/constants';

const Loans = [
  new Loan(
    314159.26,
    0.0535,
    12,
    15,
    "house",
  ),
  new Loan(
    27182.81,
    0.0828,
    12,
    4,
    "e-car",
    23456.78,
    200,
  ),
  new Loan(
    10000,
    0.0342,
    12,
    10,
    "tau",
    6283.19,
  ),
];
const Budgets = [1200, 555, 200];

describe('Core Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('toggles dates', () => {
    const coreState = useCoreStore();
    expect(coreState.Time).toBe(constants.PERIOD);
    coreState.periodsAsDates = true;
    expect(coreState.Time).toBe(constants.DATE);
  });

  it('sets rounding scale', () => {
    const coreState = useCoreStore();
    expect(coreState.roundUp).toBe(false);
    expect(coreState.roundingScale).toBe(100);
    coreState.toggleRounding(200);
    expect(coreState.roundUp).toBe(true);
    expect(coreState.roundingScale).toBe(200);
  });

  it('preserves rounding scale', () => {
    const coreState = useCoreStore();
    expect(coreState.roundUp).toBe(false);
    expect(coreState.roundingScale).toBe(100);
    coreState.toggleRounding('fish');
    expect(coreState.roundUp).toBe(true);
    expect(coreState.roundingScale).toBe(100);
  });

  it('sorts loans', () => {
    const coreState = useCoreStore();
    coreState.loans = Loans;
    expect(coreState.snowballSort).toBe(false);

    coreState.sortLoans();
    expect(
      coreState.loans.map((loan) => loan.name)
    ).toStrictEqual(["e-car", "house", "tau"]);

    coreState.toggleSnowballSort();
    expect(coreState.snowballSort).toBe(true);
    expect(
      coreState.loans.map((loan) => loan.name)
    ).toStrictEqual(["tau", "e-car", "house"]);
  });
})