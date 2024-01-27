<!-- <script>
import { inject, ref } from 'vue';

export default {
  props: [
    'index',
    'keyPrefix',
    'paymentSummary',
    'title',
  ],
  setup() {
    const options = inject('options');
    const baseDate = ref(options.baseDate);
    const periodsAsDates = ref(options.periodsAsDates);

    return {
      baseDate,
      periodsAsDates,
    };
  },
  methods: {
    renderPeriod(period) {
      return this.options.periodsAsDates
        ? new Date(
          this.options.baseDate.getFullYear(),
          this.options.baseDate.getMonth() + period,
          this.options.baseDate.getDate(),
        ).toLocaleDateString()
        : period;
    },
  },
};
</script> -->

<script setup>
import { inject, ref } from 'vue';

const props = defineProps(['keyPrefix', 'paymentSummary', 'title']);
// const options = inject('options');
// const baseDate = ref(options.baseDate);
// const periodsAsDates = ref(options.periodsAsDates);

// const renderPeriod = (period) => {
//   return periodsAsDates.value
//     ? new Date(
//       baseDate.value.getFullYear(),
//       baseDate.value.getMonth() + period,
//       baseDate.value.getDate(),
//     ).toLocaleDateString()
//     : period;
// };
</script>

<template>
  <div>
    <div>
      <h3 :class="['cardTitle']">{{ props.title }}</h3>
    </div>
    <div :class="['justifyCenter']">
      <table :class="['table']">
        <thead id='AmortizationTotalsTHead'>
          <th :class="['textLeft']">Payment Number</th>
          <th :class="['textRight']">Amount Paid</th>
          <th :class="['textRight']">Principal Paid</th>
          <th :class="['textRight']">Interest Paid</th>
          <th :class="['textRight']">Principal Remaining</th>
        </thead>
        <tr
          v-for='(record, rowno) in props.paymentSummary.amortizationSchedule'
          :key='props.keyPrefix + rowno'
        >
          <td :class="['textLeft']">{{ record.period }}</td>
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
