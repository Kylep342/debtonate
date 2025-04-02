<script setup lang="ts">
import { computed } from 'vue';
import { ContributionSchedule } from 'moneyfunx';

import useAppreciateCoreStore from '../stores/core';
import useGlobalOptionsStore from '@/apps/shared/stores/globalOptions';

defineProps<{
  contributionSchedule: ContributionSchedule,
  title: string,
  subtitle: string,
}>();

const globalOptions = useGlobalOptionsStore();
const state = useAppreciateCoreStore();

const paymentHeader = computed<string>(() => (globalOptions.periodsAsDates ? 'Payment Date' : 'Payment Number'));
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
                Total Growth
              </th>
              <th :class="['text-right']">
                Contribution
              </th>
              <th :class="['text-right']">
                Interest
              </th>
              <th :class="['text-right']">
                Current Balance
              </th>
            </tr>
          </thead>
        </template>
        <template #body>
          <tbody>
            <tr v-for="(record, rowno) in contributionSchedule.amortizationSchedule" :key="rowno">
              <td :class="['text-center']">
                {{ globalOptions.Period(record.period, true) }}
              </td>
              <td :class="['text-right']">
                {{ globalOptions.Money(record.growth + record.contribution) }}
              </td>
              <td :class="['text-right']">
                {{ globalOptions.Money(record.contribution) }}
              </td>
              <td :class="['text-right']">
                {{ globalOptions.Money(record.growth) }}
              </td>
              <td :class="['text-right']">
                {{ globalOptions.Money(record.currentBalance) }}
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
                  globalOptions.Money(
                    contributionSchedule.lifetimeContribution +
                    contributionSchedule.lifetimeGrowth
                  )
                }}</b>
              </td>
              <td :class="['text-right']">
                <b>{{ globalOptions.Money(contributionSchedule.lifetimeContribution) }}</b>
              </td>
              <td :class="['text-right']">
                <b>{{ globalOptions.Money(contributionSchedule.lifetimeGrowth) }}</b>
              </td>
              <td :class="['text-right']">
                <b>{{
                  globalOptions.Money(
                    contributionSchedule.lifetimeContribution +
                    contributionSchedule.lifetimeGrowth
                  )
                }}</b>
              </td>
            </tr>
          </tfoot>
        </template>
      </base-table>
    </div>
  </div>
</template>
