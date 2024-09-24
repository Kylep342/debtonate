<script setup>
import { inject, reactive } from 'vue';

const props = defineProps(['loanId', 'title', 'subtitle']);

const budgetPrimitives = inject('budgetPrimitives');
const getters = inject('getters');
const formatters = inject('formatters');
const options = inject('options');

const monthlyBudgets = reactive(budgetPrimitives.monthlyBudgets);

const relativeTime = (periods) => (
  options.periodsAsDates.value ? (
    `${Math.floor(periods / 12) ? `${Math.abs(Math.floor(periods / 12))} years, ` : ''}${periods % 12 ? `${Math.abs(periods % 12)} months` : ''}`
  ) : `${Math.abs(periods)} periods`
);

const content = (downId, acrossId) => {
  if (downId === acrossId) {
    return '';
  }
  const priceDelta = getters.getLifetimeInterest(
    props.loanId,
    acrossId,
  ) - getters.getLifetimeInterest(
    props.loanId,
    downId,
  );

  const timeDelta = getters.getNumPayments(
    props.loanId,
    acrossId,
  ) - getters.getNumPayments(
    props.loanId,
    downId,
  );

  const costText = `${formatters.Money(priceDelta)}`;

  const timeText = `
  ${relativeTime(timeDelta)}
  ${timeDelta > 0 ? ' earlier' : ' later'}
  `;

  return `${costText}\n${timeText}`;
};
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
              <th :class="['text-right']"><b>DOWN -> ACROSS</b></th>
              <th v-for="budget in monthlyBudgets" :key="budget.id"><b>{{
                budgetPrimitives.getBudgetName(budget.id) }}</b></th>
            </tr>
          </thead>
        </template>
        <template #body>
          <tbody>
            <tr v-for="(down) in monthlyBudgets" :key="down.id">
              <td :class="['text-center']">{{ budgetPrimitives.getBudgetName(down.id) }}</td>
              <td v-for="(across) in monthlyBudgets" :key="down.id + across.id">
                {{ content(down.id, across.id) }}
              </td>
            </tr>
          </tbody>
        </template>
      </base-table>
    </div>
  </div>
</template>
