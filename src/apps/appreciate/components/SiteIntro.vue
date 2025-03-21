<script setup lang="ts">
import useGlobalOptionsStore from '@/apps/shared/stores/globalOptions';

const globalOptions = useGlobalOptionsStore()
</script>

<template>
  <div :class="['w-1/2']">
    <p>Welcome to Appreciate!</p>
    <br>
    <p>
      Appreciate is a financial calculator for analyzing investments.
      Specifically, it lives to answer the question:
      What if I could put an extra {{ globalOptions.Money(50) }}/month towards my retirement? Or {{ globalOptions.Money(100) }}...?
      Appreciate empowers you to plan your finances with data-rich analysis.
    </p>
    <br>
    <p>
      To get started, add some instruments (investments).
      From there, add a few budgets, which represent additional contributions
      per month over your minimum contribution.
    </p>
  </div>
</template>
