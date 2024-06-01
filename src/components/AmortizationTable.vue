<script setup>
import { computed, inject, ref } from 'vue';

const props = defineProps(['keyPrefix', 'paymentSummary', 'title']);
const options = inject('options');
const baseDate = ref(options.baseDate);
const periodsAsDates = ref(options.periodsAsDates);

const keyPrefix = ref(props.keyPrefix);
const paymentSummary = ref(props.paymentSummary);
const title = ref(props.title);

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
      <h3 :class="['cardTitle']">{{ title }}</h3>
    </div>
    <div :class="['justifyCenter']">
      <table :class="['table']">
        <thead id="AmortizationTotalsTHead">
          <th :class="['textRight']">{{ paymentHeader }}</th>
          <th :class="['textRight']">Amount Paid</th>
          <th :class="['textRight']">Principal Paid</th>
          <th :class="['textRight']">Interest Paid</th>
          <th :class="['textRight']">Principal Remaining</th>
        </thead>
        <tr
          v-for="(record, rowno) in paymentSummary.amortizationSchedule"
          :key="keyPrefix + rowno"
        >
          <td :class="['textRight']">{{ renderPeriod(record.period) }}</td>
          <td :class="['textRight']">
            ${{ (record.principal + record.interest).toFixed(2) }}
          </td>
          <td :class="['textRight']">${{ record.principal.toFixed(2) }}</td>
          <td :class="['textRight']">${{ record.interest.toFixed(2) }}</td>
          <td :class="['textRight']">
            ${{ record.principalRemaining.toFixed(2) }}
          </td>
        </tr>
        <tr>
          <td :class="['textLeft']"><b>Totals:</b></td>
          <td :class="['textRight']">
            <b
              >${{
                (
                  paymentSummary?.totalPrincipalPaid +
                  paymentSummary?.totalInterestPaid
                ).toFixed(2)
              }}</b
            >
          </td>
          <td :class="['textRight']">
            <b>${{ paymentSummary?.totalPrincipalPaid?.toFixed(2) }}</b>
          </td>
          <td :class="['textRight']">
            <b>${{ paymentSummary?.totalInterestPaid?.toFixed(2) }}</b>
          </td>
          <td :class="['textRight']"><b> -- </b></td>
        </tr>
      </table>
    </div>
  </div>
</template>
