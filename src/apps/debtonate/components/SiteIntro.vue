<script setup lang="ts">
import useGlobalOptionsStore from '@/apps/shared/stores/globalOptions';

const globalOptions = useGlobalOptionsStore()
</script>

<template>
  <div :class="['w-1/2']">
    <p>Welcome to Debtonate!</p>
    <br>
    <p>
      Debtonate is a financial calculator for analyzing debt.
      Specifically, it lives to answer the question:
      What if I could put an extra {{ globalOptions.Money(50) }}/month towards my debt? Or {{ globalOptions.Money(100) }}...?
      Debtonate empowers you to plan your finances with data-rich analysis.
    </p>
    <br>
    <p>
      To get started, add some loans.
      From there, add a few budgets, which represent additional payments
      per month over your minimum payment.
    </p>
  </div>
</template>
