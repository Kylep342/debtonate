<script setup>
import useCoreStore from '../stores/core';

const props = defineProps(['loanId', 'title', 'subtitle']);

const coreState = useCoreStore();

const cellContent = (downId, acrossId) => {
  if (downId === acrossId) {
    return '';
  }
  const interestDelta = coreState.getLifetimeInterest(
    props.loanId,
    acrossId,
  ) - coreState.getLifetimeInterest(
    props.loanId,
    downId,
  );

  const timeDelta = coreState.getNumPayments(
    props.loanId,
    acrossId,
  ) - coreState.getNumPayments(
    props.loanId,
    downId,
  );

  const relativeYears = (timeDelta) => {
    const years = Math.floor(Math.abs(timeDelta / 12))
    switch(years) {
      case 0:
        return '';
      case 1:
        return `${years} year`;
      default:
        return `${years} years`;
    }
  };

  const relativeMonths = (timeDelta) => {
    const months = Math.floor(Math.abs(timeDelta % 12))
    switch(months) {
      case 0:
        return '';
      case 1:
        return `${months} month`;
      default:
        return `${months} months`;
    }
  };

const relativeTime = (periods) => (
  coreState.periodsAsDates ? (
    `${relativeYears(periods)} ${relativeMonths(periods)}`
  ) : `${Math.abs(periods)} periods`
);

  const costText = `${coreState.Money(interestDelta)}`;

  const timeText = `${relativeTime(timeDelta)} ${timeDelta > 0 ? ' earlier' : ' later'}`;

  return { costText, timeText };
};
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
                <b>DOWN → ACROSS</b>
              </th>
              <th
                v-for="budget in coreState.monthlyBudgets"
                :key="budget.id"
              >
                <b>{{
                  coreState.getBudgetName(budget.id) }}</b>
              </th>
            </tr>
          </thead>
        </template>
        <template #body>
          <tbody>
            <tr
              v-for="(down) in coreState.monthlyBudgets"
              :key="down.id"
            >
              <td :class="['text-center']">
                {{ coreState.getBudgetName(down.id) }}
              </td>
              <td
                v-for="(across) in coreState.monthlyBudgets"
                :key="down.id + across.id"
              >
                <ul>
                  <li
                    v-for="(key, rownum) in Object.keys(cellContent(down.id, across.id))"
                    :key="rownum"
                  >
                    {{ cellContent(down.id, across.id)[key] }}
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </template>
      </base-table>
    </div>
  </div>
</template>
