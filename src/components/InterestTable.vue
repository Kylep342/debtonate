<script setup>
import useCoreStore from '../stores/core';

const props = defineProps(['loanId', 'title', 'subtitle']);

const state = useCoreStore();

const cellContent = (downId, acrossId) => {
  if (downId === acrossId) {
    return '';
  }
  const interestDelta = state.getLifetimeInterest(
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
  state.periodsAsDates ? (
    `${relativeYears(periods)} ${relativeMonths(periods)}`
  ) : `${Math.abs(periods)} periods`
);

  const costText = `${state.Money(interestDelta)}`;

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
                v-for="budget in state.monthlyBudgets"
                :key="budget.id"
              >
                <b>{{
                  state.getBudgetName(budget.id) }}</b>
              </th>
            </tr>
          </thead>
        </template>
        <template #body>
          <tbody>
            <tr
              v-for="(down) in state.monthlyBudgets"
              :key="down.id"
            >
              <td :class="['text-center']">
                {{ state.getBudgetName(down.id) }}
              </td>
              <td
                v-for="(across) in state.monthlyBudgets"
                :key="down.id + across.id"
              >
                <ul>
                  <li
                    v-for="(key, rownum) in Object.keys(cellContent(down.id, across.id))"
                    :key="rownum"
                  >
<<<<<<< HEAD
                    {{
                      cellContent(down.id,
                                  across.id)[key] }}
=======
                    {{ cellContent(down.id, across.id)[key] }}
>>>>>>> develop
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
