<script setup>
import { computed, inject, ref } from 'vue';

defineProps(['paymentSummary', 'title', 'subtitle']);

const formatters = inject('formatters');
const options = inject('options');

const periodsAsDates = ref(options.periodsAsDates);

const paymentHeader = computed(() => (periodsAsDates.value ? 'Payment Date' : 'Payment Number'));
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
            <tr v-for="(record, rowno) in paymentSummary.amortizationSchedule" :key="rowno">
              <td :class="['text-center']">{{ formatters.formatPeriod(record.period, true) }}</td>
              <td :class="['text-right']">
                {{ formatters.Money(record.interest + record.principal) }}
              </td>
              <td :class="['text-right']">{{ formatters.Money(record.principal) }}</td>
              <td :class="['text-right']">{{ formatters.Money(record.interest) }}</td>
              <td :class="['text-right']">
                {{ formatters.Money(record.principalRemaining) }}
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
                  formatters.Money(
                    paymentSummary.totalPrincipalPaid +
                    paymentSummary.totalInterestPaid
                  )
                }}</b>
              </td>
              <td :class="['text-right']">
                <b>{{ formatters.Money(paymentSummary.totalPrincipalPaid) }}</b>
              </td>
              <td :class="['text-right']">
                <b>{{ formatters.Money(paymentSummary.totalInterestPaid) }}</b>
              </td>
              <td :class="['text-right']"><b>{{ formatters.Money(0) }}</b></td>
            </tr>
          </tfoot>
        </template>
      </base-table>
    </div>
  </div>
</template>
