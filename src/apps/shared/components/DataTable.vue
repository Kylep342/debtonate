<script setup lang="ts">
import { TableHeader } from '@/apps/shared/types/app';

defineProps<{
  title: string;
  subtitle: string;
  headers: TableHeader[];
  rows: Record<string, string>[];
  totals: Record<string, string>;
}>();
</script>

<template>
  <div>
    <header>
      <h3 :class="['text-center']">{{ title }}</h3>
      <h5 :class="['text-center']">{{ subtitle }}</h5>
    </header>
    <div :class="['justifyCenter', 'max-h-90', 'overflow-y-auto']">
      <base-table :class="['table-sm']">
        <template #header>
          <thead>
            <tr>
              <th v-for="header in headers" :key="header.key" :class="header.class || 'text-right'">
                {{ header.label }}
              </th>
            </tr>
          </thead>
        </template>
        <template #body>
          <tbody>
            <tr v-for="(row, index) in rows" :key="index">
              <td v-for="header in headers" :key="header.key" :class="header.class || 'text-right'">
                {{ row[header.key] }}
              </td>
            </tr>
          </tbody>
        </template>
        <template #footer>
          <tfoot>
            <tr>
              <td v-for="header in headers" :key="header.key" :class="header.class || 'text-right'">
                <b>{{ totals[header.key] }}</b>
              </td>
            </tr>
          </tfoot>
        </template>
      </base-table>
    </div>
  </div>
</template>
