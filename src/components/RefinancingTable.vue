<script setup>
import { computed } from 'vue';

import constants from '../constants/constants';
import useCoreStore from '../stores/core';

const props = defineProps(['parentId', 'scenarios']);

const coreState = useCoreStore();

const parentLoan = computed(() => coreState.getLoan(props.parentId))
const title = computed(() => coreState.buildRefinancingTableTitle(coreState.getLoan(props.parentId)))

const interest = (scenario) => scenario.paymentSchedule[scenario.loan.id].lifetimeInterest

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
                <b>Scenario Summary</b>
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
              <td> {{ coreState.getLoanName(parentLoan.id) }}</td>
              <td>{{ coreState.buildLoanSubtitle(parentLoan) }}</td>
              <td :class="['text-right']">{{ coreState.Money(coreState.getLifetimeInterest(parentLoan.id, constants.DEFAULT)) }}</td>
              <td :class="['text-right']">{{ coreState.Money(0) }}</td>
              <td :class="['text-right']">{{ coreState.Money(coreState.getLifetimeInterest(parentLoan.id, constants.DEFAULT)) }}</td>
              <td :class="['text-right']">{{ coreState.getNumPayments(parentLoan.id, constants.DEFAULT) }}</td>
            </tr>
            <tr
              v-for="(scenario) in scenarios"
              :key="scenario.loan.id"
            >
              <td> {{ scenario.loan.name }}</td>
              <td>{{ coreState.buildLoanSubtitle(scenario.loan) }}</td>
              <td :class="['text-right']">{{ coreState.Money(interest(scenario)) }}</td>
              <td :class="['text-right']">{{ coreState.Money(scenario.fees) }}</td>
              <td :class="['text-right']">{{ coreState.Money(interest(scenario) + scenario.fees) }}</td>
              <td :class="['text-right']">{{ scenario.paymentSchedule[scenario.loan.id].amortizationSchedule.length }}</td>
              <td>
                <base-button
                  :class="['btn-error']"
                  @click="coreState.deleteRefinancingScenario(parentId, scenario.loan.id)"
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
