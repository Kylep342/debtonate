<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  analysis: Record<string, Record<string, any>>;
  items: any[]; // budgets or loans/scenarios
  title: string;
  getItemName: (id: string) => string;
}>();

const metrics = computed(() => Object.keys(props.analysis));

</script>

<template>
  <div :class="['card', 'bg-base-200', 'shadow-xl', 'p-4', 'mt-4']">
    <h3 :class="['text-xl', 'font-bold', 'mb-4', 'text-center']">{{ title }}</h3>
    <div :class="['overflow-x-auto']">
      <table :class="['table', 'table-zebra', 'w-full']">
        <thead>
          <tr>
            <th>Metric</th>
            <th v-for="item in items" :key="item.id" :class="['text-right']">
              {{ getItemName(item.id) }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="metric in metrics" :key="metric">
            <td :class="['font-semibold']">{{ metric }}</td>
            <td v-for="item in items" :key="item.id" :class="['text-right']">
              {{ analysis[metric][item.id] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
