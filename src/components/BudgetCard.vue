<script setup>
import { computed, inject } from 'vue';
import constants from '../constants/constants';

const props = defineProps(['budget', 'budgetTotals', 'index']);
const budgetPrimitives = inject('budgetPrimitives');

const budgetAmount = computed(() => `$${props.budget.absolute.toFixed(2)}/mo`);
const budgetExtra = computed(() => `+$${props.budget.relative.toFixed(2)}/mo`);
const budgetPayments = computed(() => props.budgetTotals.amortizationSchedule.length);
const budgetTitle = computed(() => (
  props.budget.id === constants.DEFAULT ? 'Minimum' : `Budget ${props.index}`
));
const budgetTotalInterest = computed(() => `$${props.budgetTotals.lifetimeInterest.toFixed(2)}`);
</script>

<template>
  <div>
    <div :class="['cardHeader', 'header']">
      <h2 :class="['cardHeaderTitle']">{{ budgetTitle }}</h2>
      <div :class="['cardheaderSubSection']">
        <button v-if="budget.id !== constants.DEFAULT"
          :class="['exitButton', 'bold', 'btn', 'btn-ghost', 'btn-square']"
          @click='budgetPrimitives.deleteBudget(props.budget.id)'
        >
          x
        </button>
      </div>
    </div>
    <div :class="['cardBody']">
      <table :class="['cardTable']">
        <tr>
          <td :class="['textLeft']">Amount</td>
          <td :class="['textRight']">
            <b>{{ budgetAmount }}</b>
          </td>
        </tr>
        <tr v-if="props.budget.id !== constants.DEFAULT">
          <td :class="['textLeft']">Extra</td>
          <td :class="['textRight']">
            <b>{{ budgetExtra }}</b>
          </td>
        </tr>
        <tr>
          <td :class="['textLeft']">Interest</td>
          <td :class="['textRight']">
            <b>{{ budgetTotalInterest }}</b>
          </td>
        </tr>
        <tr>
          <td :class="['textLeft']">Payments</td>
          <td :class="['textRight']">
            <b>{{ budgetPayments }}</b>
          </td>
        </tr>
      </table>
    </div>
    <div :class="['cardFooter', 'footer']">
      <div v-if="props.budget.id !== constants.DEFAULT" :class="['cardFooterButtonContainer']">
        <base-button @click='budgetPrimitives.editBudget(props.budget.id)'>Edit</base-button>
      </div>
      <div :class="['cardFooterButtonContainer']">
        <base-button @click='budgetPrimitives.viewBudget(props.budget.id)'>View</base-button>
      </div>
    </div>
  </div>
</template>
