<script setup>
import { computed } from 'vue';
import useCoreStore from '../stores/core';

defineProps(['paymentSummary', 'title', 'subtitle']);

const state = useCoreStore();

const paymentHeader = computed(() => (state.periodsAsDates ? 'Payment Date' : 'Payment Number'));
</script>

<template>
  <div>
    <div>
      <h3 :class="['text-center']">{{ title }}</h3>
      <h5 :class="['text-center']">{{ subtitle }}</h5>
    </div>
    <div :class="['justifyCenter', 'max-h-90', 'overflow-y-auto']">
      <base-table :class="['table-sm']">
        <template #header>
          <thead>
            <tr>
              <th :class="['text-right']">{{ paymentHeader }}</th>
              <th :class="['text-right']">Amount Paid</th>
              <th :class="['text-right']">Principal Paid</th>
              <th :class="['text-right']">Interest Paid</th>
              <th :class="['text-right']">Principal Remaining</th>
            </tr>
          </thead>
        </template>
        <template #body>
          <tbody>
            <tr v-for="(record, rowno) in paymentSummary.amortizationSchedule"
:key="rowno">
              <!-- NOTE: move the old 'formatters' section to core functions and extract defaults into shared interface here -->
              <td :class="['text-center']">{{ state.formatPeriod(record.period, true) }}</td>
              <td :class="['text-right']">
                {{ state.Money(record.interest + record.principal) }}
              </td>
              <td :class="['text-right']">{{ state.Money(record.principal) }}</td>
              <td :class="['text-right']">{{ state.Money(record.interest) }}</td>
              <td :class="['text-right']">
                {{ state.Money(record.principalRemaining) }}
              </td>
            </tr>
          </tbody>
        </template>
        <template #footer>
          <tfoot>
            <tr>
              <td :class="['textLeft']"><b>Totals:</b></td>
              <td :class="['text-right']">
                <b>{{
                  state.Money(
                    paymentSummary.totalPrincipalPaid +
                    paymentSummary.totalInterestPaid
                  )
                }}</b>
              </td>
              <td :class="['text-right']">
                <b>{{ state.Money(paymentSummary.totalPrincipalPaid) }}</b>
              </td>
              <td :class="['text-right']">
                <b>{{ state.Money(paymentSummary.totalInterestPaid) }}</b>
              </td>
              <td :class="['text-right']"><b>{{ state.Money(0) }}</b></td>
            </tr>
          </tfoot>
        </template>
      </base-table>
    </div>
  </div>
</template>
