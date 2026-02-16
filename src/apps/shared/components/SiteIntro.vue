<script setup lang="ts">
import { useGlobalOptionsStore, GlobalOptionsStore } from '@/apps/shared/stores/globalOptions';

defineProps<{
  appName: string;
  appDescription: string;
  itemType: string; // 'instruments (investments)' or 'loans'
  budgetAction: string; // 'contributions' or 'payments'
}>();

const globalOptions: GlobalOptionsStore = useGlobalOptionsStore()
</script>

<template>
  <div :class="['w-1/2']">
    <p>Welcome to {{ appName }}!</p>
    <br>
    <p>
      {{ appName }} is a financial calculator for {{ appDescription }}.
      Specifically, it lives to answer the question:
      What if I could put an extra {{ globalOptions.Money(50) }}/month towards my {{ budgetAction === 'contributions' ? 'retirement' : 'debt' }}? Or {{ globalOptions.Money(100) }}...?
      {{ appName }} empowers you to plan your finances with data-rich analysis.
    </p>
    <br>
    <p>
      To get started, add some {{ itemType }}.
      From there, add a few budgets, which represent additional {{ budgetAction }}
      per month over your minimum {{ budgetAction === 'contributions' ? 'contribution' : 'payment' }}.
    </p>
  </div>
</template>
