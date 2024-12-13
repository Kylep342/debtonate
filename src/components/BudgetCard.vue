<script setup>
import { computed } from 'vue';
import constants from '../constants/constants';
import useCoreStore from '../stores/core';

const props = defineProps(['budget', 'budgetTotals']);

const coreState = useCoreStore();

const budgetAmount = computed(() => `${coreState.Money(props.budget.absolute)}/month`);
const budgetExtra = computed(() => `${coreState.Money(props.budget.relative)}/month`);
const budgetPayments = computed(() => coreState.Period(props.budgetTotals.amortizationSchedule.length, true));
const budgetTotalInterest = computed(() => `${coreState.Money(props.budgetTotals.lifetimeInterest)}`);

const paymentsLabel = computed(() => coreState.periodsAsDates ? 'Debt Free' : 'Payments')

const baseButtons = {
  [constants.BTN_DETAILS]: coreState.viewBudget,
}

const editButtons = {
  ...baseButtons,
  [constants.BTN_EDIT]: coreState.editBudget,
  [constants.BTN_DELETE]: coreState.deleteBudget,
}

const getButtons = (budgetId) => budgetId === constants.DEFAULT ? baseButtons : editButtons;

</script>

<template>
  <base-card :class="['w-75', 'bg-base-100']">
    <template #cardTitle>
      <div class="card-actions flow-root">
        <div :class="['flex', 'justify-between', 'pr-4']">
          <h2 :class="['cardHeaderTitle', 'float-left', 'p-4']">
            {{ coreState.getBudgetName(budget.id) }}
          </h2>
          <div className="dropdown dropdown-bottom dropdown-end">
            <base-button>{{ constants.BTN_MENU }}</base-button>
            <ul
              tabIndex="{0}"
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li
                v-for="(onClick, text) in getButtons(budget.id)"
                :key="text"
                @click="onClick(budget.id)"
              >
                <a>{{ text }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>
    <template #cardBody>
      <base-table :class="['table-sm']">
        <template #body>
          <tbody>
            <tr>
              <td>Amount</td>
              <td :class="['text-right']">
                <b>{{ budgetAmount }}</b>
              </td>
            </tr>
            <tr v-if="budget.id !== constants.DEFAULT">
              <td>Extra</td>
              <td :class="['text-right']">
                <b>{{ budgetExtra }}</b>
              </td>
            </tr>
            <tr>
              <td>Interest Paid</td>
              <td :class="['text-right']">
                <b>{{ budgetTotalInterest }}</b>
              </td>
            </tr>
            <tr>
              <td>{{ paymentsLabel }}</td>
              <td :class="['text-right']">
                <b>{{ budgetPayments }}</b>
              </td>
            </tr>
          </tbody>
        </template>
      </base-table>
    </template>
  </base-card>
</template>
