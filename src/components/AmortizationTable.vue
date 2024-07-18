<script setup>
import { computed, inject, ref } from 'vue';

const props = defineProps(['keyPrefix', 'paymentSummary', 'title', 'subtitle']);
const keyPrefix = ref(props.keyPrefix);
const paymentSummary = ref(props.paymentSummary);
const title = ref(props.title);

const options = inject('options');
const baseDate = ref(options.baseDate);
const periodsAsDates = ref(options.periodsAsDates);

const renderPeriod = (period) => {
  if (periodsAsDates.value) {
    const date = new Date(baseDate.value);
    return new Date(
      date.getFullYear(),
      date.getMonth() + period,
      date.getDate(),
    ).toLocaleDateString();
  }
  return period;
};

const paymentHeader = computed(() => (periodsAsDates.value ? 'Payment Date' : 'Payment Number'));
</script>

<template>
  <div>
    <div>
      <h3 :class="['text-center']">{{ title }}</h3>
      <h5 :class="['text-center']">{{ subtitle }}</h5>
    </div>
    <div :class="['justifyCenter']">
      <base-table :class="['table-sm', 'max-h-48', 'overflow-y-auto']">
        <template #header>
          <thead>
            <th :class="['text-right']">{{ paymentHeader }}</th>
            <th :class="['text-right']">Amount Paid</th>
            <th :class="['text-right']">Principal Paid</th>
            <th :class="['text-right']">Interest Paid</th>
            <th :class="['text-right']">Principal Remaining</th>
          </thead>
        </template>
        <template #body>
          <tbody>
            <tr v-for="(record, rowno) in paymentSummary.amortizationSchedule" :key="keyPrefix + rowno">
              <td :class="['text-center']">{{ renderPeriod(record.period) }}</td>
              <td :class="['text-right']">
                ${{ (record.principal + record.interest).toFixed(2) }}
              </td>
              <td :class="['text-right']">${{ record.principal.toFixed(2) }}</td>
              <td :class="['text-right']">${{ record.interest.toFixed(2) }}</td>
              <td :class="['text-right']">
                ${{ record.principalRemaining.toFixed(2) }}
              </td>
            </tr>
          </tbody>
        </template>
        <template #footer>
          <tfoot>
            <tr>
              <td :class="['textLeft']"><b>Totals:</b></td>
              <td :class="['text-right']">
                <b>${{
                  (
                    paymentSummary.totalPrincipalPaid +
                    paymentSummary.totalInterestPaid
                  ).toFixed(2)
                }}</b>
              </td>
              <td :class="['text-right']">
                <b>${{ paymentSummary.totalPrincipalPaid.toFixed(2) }}</b>
              </td>
              <td :class="['text-right']">
                <b>${{ paymentSummary.totalInterestPaid.toFixed(2) }}</b>
              </td>
              <td :class="['text-right']"><b> $0.00 </b></td>
            </tr>
          </tfoot>
        </template>
      </base-table>
    </div>
  </div>
</template>
