<script setup lang="ts">
import { computed } from 'vue';
import { Loan, LoansPaymentSchedule } from 'moneyfunx';

import constants from '@/constants/constants';
import useCoreStore from '@/stores/core';

const props = defineProps<{
  parentId: string,
  scenarios: Array<Loan>,
  schedules: Record<string, LoansPaymentSchedule>,
}>();

const coreState = useCoreStore();
const parentLoan = computed(() => coreState.getLoan(props.parentId))

const buildRefinancingTableTitle = (loan) => `Refinancing Scenarios - ${coreState.getLoanName(loan.id)}`;
const title = computed(() => buildRefinancingTableTitle(coreState.getLoan(props.parentId)))

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
              <td>{{ coreState.getLoanName(parentLoan.id) }}</td>
              <td>{{ coreState.Percent(parentLoan.annualRate * 100) }}</td>
              <td>{{ parentLoan.termInYears }}</td>
              <td>{{ coreState.Money(parentLoan.minPayment) }}</td>
              <td :class="['text-right']">
                {{ coreState.Money(coreState.getLifetimeInterest(parentLoan.id, constants.DEFAULT)) }}
              </td>
              <td :class="['text-right']">
                {{ coreState.Money(parentLoan.fees) }}
              </td>
              <td :class="['text-right']">
                {{ coreState.Money(coreState.getLifetimeInterest(parentLoan.id, constants.DEFAULT) + parentLoan.fees) }}
              </td>
              <td :class="['text-right']">
                {{ coreState.getNumPayments(parentLoan.id, constants.DEFAULT) }}
              </td>
            </tr>
            <tr
              v-for="(scenario) in scenarios"
              :key="scenario.id"
            >
              <td>{{ scenario.name }}</td>
              <td>{{ coreState.Percent(scenario.annualRate * 100) }}</td>
              <td>{{ scenario.termInYears }}</td>
              <td>{{ coreState.Money(schedules[scenario.id].paymentAmount) }}</td>
              <td :class="['text-right']">
                {{ coreState.Money(interest(scenario.id)) }}
              </td>
              <td :class="['text-right']">
                {{ coreState.Money(scenario.fees) }}
              </td>
              <td :class="['text-right']">
                {{ coreState.Money(interest(scenario.id) + scenario.fees) }}
              </td>
              <td :class="['text-right']">
                {{ schedules[scenario.id].paymentSchedule.amortizationSchedule.length }}
              </td>
              <td>
                <base-button
                  :class="['btn-error']"
                  @click="coreState.deleteRefinancingScenario(parentId, scenario.id)"
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
