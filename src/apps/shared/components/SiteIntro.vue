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
  <div class="w-full text-pretty">
    <div class="card bg-base-200/50 border border-base-content/10 shadow-sm p-5 sm:p-6 rounded-2xl">
      <h2 class="text-xl font-bold tracking-tight mb-3 text-base-content">
        Welcome to {{ appName }}!
      </h2>
      <p class="leading-relaxed mb-3 text-base-content/85">
        {{ appName }} is a financial calculator for {{ appDescription }}.
        Specifically, it lives to answer the question:
        <em>What if I could put an extra {{ globalOptions.Money(50) }}/month towards my {{ budgetAction === 'contributions' ? 'retirement' : 'debt' }}? Or {{ globalOptions.Money(100) }}...?</em>
        {{ appName }} empowers you to plan your finances with data-rich analysis.
      </p>
      <p class="leading-relaxed text-base-content/85">
        To get started, add some {{ itemType }}.
        From there, add a few budgets, which represent additional {{ budgetAction }}
        per month over your minimum {{ budgetAction === 'contributions' ? 'contribution' : 'payment' }}.
      </p>
    </div>
  </div>
</template>

