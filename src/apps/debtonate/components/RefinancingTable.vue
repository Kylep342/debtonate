<script setup lang="ts">
import { computed } from 'vue';
import { Loan, LoansPaymentSchedule } from 'moneyfunx';

import constants from '@/apps/debtonate/constants/constants';
import useDebtonateCoreStore from '@/apps/debtonate/stores/core';
import useGlobalOptionsStore from '@/apps/shared/stores/globalOptions';

const props = defineProps<{
  parentId: string,
  scenarios: Array<Loan>,
  schedules: Record<string, LoansPaymentSchedule>,
}>();

const globalOptions = useGlobalOptionsStore();
const state = useDebtonateCoreStore();

const parentLoan = computed(() => state.getLoan(props.parentId))

const buildRefinancingTableTitle = (loan) => `Refinancing Scenarios - ${state.getLoanName(loan.id)}`;
const title = computed(() => buildRefinancingTableTitle(state.getLoan(props.parentId)))

const interest = (scenarioId) => props.schedules[scenarioId].paymentSchedule.lifetimeInterest
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
              <th>
                <b>Scenario Name</b>
              </th>
              <th>
                <b>Interest Rate</b>
              </th>
              <th>
                <b>Term</b>
              </th>
              <th>
                <b>Monthly Payment</b>
              </th>
              <th :class="['text-right']">
                <b>Lifetime Interest</b>
              </th>
              <th :class="['text-right']">
                <b>Fees</b>
              </th>
              <th :class="['text-right']">
                <b>Total Premium</b>
              </th>
              <th :class="['text-right']">
                <b>Total Payments</b>
              </th>
              <th>
                <b>Actions</b>
              </th>
            </tr>
          </thead>
        </template>
        <template #body>
          <tbody>
            <tr>
              <td>{{ state.getLoanName(parentLoan.id) }}</td>
              <td>{{ globalOptions.Percent(parentLoan.annualRate * 100) }}</td>
              <td>{{ parentLoan.termInYears }}</td>
              <td>{{ globalOptions.Money(parentLoan.minPayment) }}</td>
              <td :class="['text-right']">
                {{ globalOptions.Money(state.getLifetimeInterest(parentLoan.id, constants.DEFAULT)) }}
              </td>
              <td :class="['text-right']">
                {{ globalOptions.Money(parentLoan.fees) }}
              </td>
              <td :class="['text-right']">
                {{ globalOptions.Money(state.getLifetimeInterest(parentLoan.id, constants.DEFAULT) + parentLoan.fees) }}
              </td>
              <td :class="['text-right']">
                {{ state.getNumPayments(parentLoan.id, constants.DEFAULT) }}
              </td>
            </tr>
            <tr v-for="(scenario) in scenarios" :key="scenario.id">
              <td>{{ scenario.name }}</td>
              <td>{{ globalOptions.Percent(scenario.annualRate * 100) }}</td>
              <td>{{ scenario.termInYears }}</td>
              <td>{{ globalOptions.Money(schedules[scenario.id].paymentAmount) }}</td>
              <td :class="['text-right']">
                {{ globalOptions.Money(interest(scenario.id)) }}
              </td>
              <td :class="['text-right']">
                {{ globalOptions.Money(scenario.fees) }}
              </td>
              <td :class="['text-right']">
                {{ globalOptions.Money(interest(scenario.id) + scenario.fees) }}
              </td>
              <td :class="['text-right']">
                {{ schedules[scenario.id].paymentSchedule.amortizationSchedule.length }}
              </td>
              <td>
                <base-button :class="['btn-error']" @click="state.deleteRefinancingScenario(parentId, scenario.id)">
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
