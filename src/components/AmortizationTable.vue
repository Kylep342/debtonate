<script setup>
import { computed, inject, ref } from 'vue';

const props = defineProps(['keyPrefix', 'paymentSummary', 'title']);
const options = inject('options');
const baseDate = ref(options.baseDate);
const periodsAsDates = ref(options.periodsAsDates);

const renderPeriod = (period) => (
  periodsAsDates.value
    ? new Date(
      baseDate.value.getFullYear(),
      baseDate.value.getMonth() + period,
      baseDate.value.getDate(),
    ).toLocaleDateString()
    : period
);

const paymentHeader = computed(() => (
  periodsAsDates.value
    ? 'Payment Date'
    : 'Payment Number'
));
</script>

<template>
  <div>
    <div>
      <h3 :class="['cardTitle']">{{ props.title }}</h3>
    </div>
    <div :class="['justifyCenter']">
      <table v-if='props.paymentSummary' :class="['table']">
        <thead id='AmortizationTotalsTHead'>
          <th :class="['textRight']">{{ paymentHeader }}</th>
          <th :class="['textRight']">Amount Paid</th>
          <th :class="['textRight']">Principal Paid</th>
          <th :class="['textRight']">Interest Paid</th>
          <th :class="['textRight']">Principal Remaining</th>
        </thead>
        <tr
          v-for='(record, rowno) in props.paymentSummary.amortizationSchedule'
          :key='props.keyPrefix + rowno'
        >
          <td :class="['textRight']">{{ renderPeriod(record.period) }}</td>
          <td :class="['textRight']">${{ (record.principal + record.interest).toFixed(2) }}</td>
          <td :class="['textRight']">${{ record.principal.toFixed(2) }}</td>
          <td :class="['textRight']">${{ record.interest.toFixed(2) }}</td>
          <td :class="['textRight']">
            ${{ record.principalRemaining.toFixed(2) }}
          </td>
        </tr>
        <tr>
          <td :class="['textLeft']"><b>Totals:</b></td>
          <td :class="['textRight']">
            <b>${{ (
              props.paymentSummary.totalPrincipalPaid +
              props.paymentSummary.totalInterestPaid
            ).toFixed(2) }}</b>
          </td>
          <td :class="['textRight']">
            <b>${{ props.paymentSummary.totalPrincipalPaid.toFixed(2) }}</b>
          </td>
          <td :class="['textRight']">
            <b>${{ props.paymentSummary.totalInterestPaid.toFixed(2) }}</b>
          </td>
          <td :class="['textRight']"><b> -- </b></td>
        </tr>
      </table>
    </div>
  </div>
</template>
