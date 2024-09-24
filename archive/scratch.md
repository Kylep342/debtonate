Snippets to visit later


// DetailsPanel.vue
```vue
<script>
const amortizationSchedulesChart = computed(() => {
  const currentLoanId = loanPrimitives.currentLoanId?.value;
  return props.type === constants.LOAN && currentLoanId
    ? visuals.amortizationSchedulesCharts.value[currentLoanId]
    : visuals.amortizationSchedulesCharts.value.totals;
});
</script>

<template>
<base-chart
    :chart="amortizationSchedulesChart"
    :id="'amortizationSchedulesChart'"
/>
</template>
```

// App.vue

```vue
<script>
const lifetimeInterestTotals = computed(() => [
  {
    x: monthlyBudgets.value.map(
      (budget) => `$${budget.absolute.toFixed(2)}/month`,
    ),
    y: monthlyBudgets.value.map(
      (budget) => paymentSchedules.value.find(
        (schedule) => schedule.budgetId === budget.id,
      ).paymentSchedule.totals.lifetimeInterest,
    ),
    name: 'Total Interest Paid',
    type: 'bar',
  },
]);

const lifetimeInterestTotalsChart = computed(() => ({
  id: 'lifetimeInterestTotalsChart',
  data: lifetimeInterestTotals.value,
  layout: {
    barmode: 'group',
    title: 'Total Interest Paid - All Loans',
    xaxis: {
      title: {
        text: 'Budgets',
      },
    },
    yaxis: {
      hoverformat: '$,.2f',
      tickformat: '$,.2f',
      title: {
        text: 'Interest',
      },
    },
    colorway: colors,
  },
}));
</script>

<template>
<div id="lifetimeInterestTotals">
    <base-chart
    :class="['graph']"
    :chart="lifetimeInterestTotalsChart"
    />
</div>
</template>
```
