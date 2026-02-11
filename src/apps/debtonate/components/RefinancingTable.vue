<script setup lang="ts">
import moneyfunx from 'moneyfunx';
import { computed, ComputedRef } from 'vue';

import { useDebtonateCoreStore, DebtonateCoreStore } from '@/apps/debtonate/stores/core';
import constants from '@/apps/debtonate/constants/constants';
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { PaymentScenario } from '@/apps/debtonate/types/core';

const props = defineProps<{
  parentId: string,
  scenarios: moneyfunx.Loan[],
  schedules: Record<string, PaymentScenario>,
}>();

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore();
const state: DebtonateCoreStore = useDebtonateCoreStore();

const parentLoan: ComputedRef<moneyfunx.ILoan> = computed(() => state.getLoan(props.parentId));
const title: ComputedRef<string> = computed(() => `Refinancing Scenarios - ${parentLoan.value?.name ?? ''}`);

type TableRow = {
  id: string;
  isParent: boolean;
  name: string;
  interestRate: string;
  term: number;
  monthlyPayment: string;
  lifetimeInterest: string;
  fees: string;
  totalPremium: string;
  totalPayments: number;
}

const tableRows: ComputedRef<TableRow[]> = computed(() => {
  if (!parentLoan.value) return [];

  const parentRow: TableRow = {
    id: parentLoan.value.id,
    isParent: true,
    name: state.getLoanName(parentLoan.value.id),
    interestRate: globalOptions.Percent(parentLoan.value.annualRate * 100),
    term: parentLoan.value.termInYears,
    monthlyPayment: globalOptions.Money(parentLoan.value.minPayment),
    lifetimeInterest: globalOptions.Money(state.getLifetimeInterest(parentLoan.value.id, constants.DEFAULT)),
    fees: globalOptions.Money(parentLoan.value.fees),
    totalPremium: globalOptions.Money(state.getLifetimeInterest(parentLoan.value.id, constants.DEFAULT) + parentLoan.value.fees),
    totalPayments: state.getNumPayments(parentLoan.value.id, constants.DEFAULT),
  };

  const scenarioRows = props.scenarios.map((scenario): TableRow => {
    const scenarioData = props.schedules[scenario.id];
    const specificSchedule = scenarioData.paymentSchedule[scenario.id];

    const lifetimeInterest = specificSchedule.lifetimeInterest;

    return <TableRow>{
      id: scenario.id,
      isParent: false,
      name: scenario.name,
      interestRate: globalOptions.Percent(scenario.annualRate * 100),
      term: scenario.termInYears,
      monthlyPayment: globalOptions.Money(scenarioData.paymentAmount),
      lifetimeInterest: globalOptions.Money(lifetimeInterest),
      fees: globalOptions.Money(scenario.fees),
      totalPremium: globalOptions.Money(lifetimeInterest + scenario.fees),
      totalPayments: specificSchedule.amortizationSchedule.length,
    };
  });

  return [parentRow, ...scenarioRows];
});
</script>

<template>
  <div>
    <div>
      <h3 :class="['text-center']">
        {{ title }}
      </h3>
    </div>
    <div :class="['justifyCenter', 'max-h-90', 'overflow-y-auto']">
      <base-table :class="['table-sm']">
        <template #header>
          <thead>
            <tr>
              <th><b>Scenario Name</b></th>
              <th><b>Interest Rate</b></th>
              <th><b>Term</b></th>
              <th><b>Monthly Payment</b></th>
              <th :class="['text-right']"><b>Lifetime Interest</b></th>
              <th :class="['text-right']"><b>Fees</b></th>
              <th :class="['text-right']"><b>Total Premium</b></th>
              <th :class="['text-right']"><b>Total Payments</b></th>
              <th><b>Actions</b></th>
            </tr>
          </thead>
        </template>
        <template #body>
          <tbody>
            <tr v-for="row in tableRows" :key="row.id">
              <td>{{ row.name }}</td>
              <td>{{ row.interestRate }}</td>
              <td>{{ row.term }}</td>
              <td>{{ row.monthlyPayment }}</td>
              <td :class="['text-right']">{{ row.lifetimeInterest }}</td>
              <td :class="['text-right']">{{ row.fees }}</td>
              <td :class="['text-right']">{{ row.totalPremium }}</td>
              <td :class="['text-right']">{{ row.totalPayments }}</td>
              <td>
                <base-button
                  v-if="!row.isParent"
                  :class="['btn-error']"
                  @click="state.deleteRefinancingScenario(parentId, row.id)"
                >
                  {{ constants.BTN_DELETE }}
                </base-button>
              </td>
            </tr>
          </tbody>
        </template>
      </base-table>
    </div>
  </div>
</template>