<script setup>
import useCoreStore from '../stores/core';

const props = defineProps(['loanId', 'title', 'subtitle']);

const state = useCoreStore();

const relativeTime = (periods) => (
  state.periodsAsDates ? (
    `${Math.floor(periods / 12) ? `${Math.abs(Math.floor(periods / 12))} years, ` : ''}${periods % 12 ? `${Math.abs(periods % 12)} months` : ''}`
  ) : `${Math.abs(periods)} periods`
);

const cellContent = (downId, acrossId) => {
  if (downId === acrossId) {
    return '';
  }
  const priceDelta = state.getLifetimeInterest(
    props.loanId,
    acrossId,
  ) - state.getLifetimeInterest(
    props.loanId,
    downId,
  );

  const timeDelta = state.getNumPayments(
    props.loanId,
    acrossId,
  ) - state.getNumPayments(
    props.loanId,
    downId,
  );

  const costText = `${state.Money(priceDelta)}`;

  const timeText = `${relativeTime(timeDelta)} ${timeDelta > 0 ? ' earlier' : ' later'}`;

  return { costText, timeText };
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
              <th :class="['text-right']"><b>DOWN → ACROSS</b></th>
              <th v-for="budget in state.monthlyBudgets"
:key="budget.id"><b>{{
                state.getBudgetName(budget.id) }}</b></th>
            </tr>
          </thead>
        </template>
        <template #body>
          <tbody>
            <tr v-for="(down) in state.monthlyBudgets"
:key="down.id">
              <td :class="['text-center']">{{ state.getBudgetName(down.id) }}</td>
              <td v-for="(across) in state.monthlyBudgets"
:key="down.id + across.id">
                <ul>
                  <li v-for="(key, rownum) in Object.keys(cellContent(down.id, across.id))"
:key="rownum">{{
                    cellContent(down.id,
                      across.id)[key] }}</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </template>
      </base-table>
    </div>
  </div>
</template>
