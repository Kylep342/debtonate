<script setup lang="ts">
import { computed } from 'vue';
import { PaymentSchedule } from 'moneyfunx';

import useCoreStore from '@/stores/core';

defineProps<{
  paymentSchedule: PaymentSchedule,
  title: string,
  subtitle: string,
}>();

const coreState = useCoreStore();

const paymentHeader = computed<string>(() => (coreState.periodsAsDates ? 'Payment Date' : 'Payment Number'));
</script>

<template>
  <div>
    <div>
      <h3 :class="['text-center']">
        {{ title }}
      </h3>
      <h5 :class="['text-center']">
        {{ subtitle }}
      </h5>
    </div>
    <div :class="['justifyCenter', 'max-h-90', 'overflow-y-auto']">
      <base-table :class="['table-sm']">
        <template #header>
          <thead>
            <tr>
              <th :class="['text-right']">
                {{ paymentHeader }}
              </th>
              <th :class="['text-right']">
                Amount Paid
              </th>
              <th :class="['text-right']">
                Principal Paid
              </th>
              <th :class="['text-right']">
                Interest Paid
              </th>
              <th :class="['text-right']">
                Principal Remaining
              </th>
            </tr>
          </thead>
        </template>
        <template #body>
          <tbody>
            <tr
              v-for="(record, rowno) in paymentSchedule.amortizationSchedule"
              :key="rowno"
            >
              <td :class="['text-center']">
                {{ coreState.Period(record.period, true) }}
              </td>
              <td :class="['text-right']">
                {{ coreState.Money(record.interest + record.principal) }}
              </td>
              <td :class="['text-right']">
                {{ coreState.Money(record.principal) }}
              </td>
              <td :class="['text-right']">
                {{ coreState.Money(record.interest) }}
              </td>
              <td :class="['text-right']">
                {{ coreState.Money(record.principalRemaining) }}
              </td>
            </tr>
          </tbody>
        </template>
        <template #footer>
          <tfoot>
            <tr>
              <td :class="['textLeft']">
                <b>Totals:</b>
              </td>
              <td :class="['text-right']">
                <b>{{
                  coreState.Money(
                    paymentSchedule.lifetimePrincipal +
                      paymentSchedule.lifetimeInterest
                  )
                }}</b>
              </td>
              <td :class="['text-right']">
                <b>{{ coreState.Money(paymentSchedule.lifetimePrincipal) }}</b>
              </td>
              <td :class="['text-right']">
                <b>{{ coreState.Money(paymentSchedule.lifetimeInterest) }}</b>
              </td>
              <td :class="['text-right']">
                <b>{{ coreState.Money(0) }}</b>
              </td>
            </tr>
          </tfoot>
        </template>
      </base-table>
    </div>
  </div>
</template>
