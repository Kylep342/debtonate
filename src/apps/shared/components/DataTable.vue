<script setup lang="ts">
import { TableHeader } from '@/apps/shared/types/app';
import elementIds from '@/apps/shared/constants/elementIds';
import { exportToCsv, exportToJson } from '@/apps/shared/functions/export';

const props = withDefaults(
  defineProps<{
    title: string;
    subtitle: string;
    headers: TableHeader[];
    rows: Record<string, string>[];
    totals: Record<string, string>;
    exportable?: boolean;
  }>(),
  {
    exportable: true,
  }
);

const slugify = (text: string): string =>
  (text || 'schedule')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const handleExportCsv = (): void => {
  const filename = slugify(props.title);
  exportToCsv(filename, props.headers, props.rows, props.totals);
};

const handleExportJson = (): void => {
  const filename = slugify(props.title);
  exportToJson(filename, {
    title: props.title,
    subtitle: props.subtitle,
    headers: props.headers,
    rows: props.rows,
    totals: props.totals,
    exportedAt: new Date().toISOString(),
  });
};
</script>

<template>
  <div>
    <header class="mb-2">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between px-2 gap-2">
        <div class="flex-1 text-center sm:text-left min-w-0">
          <h3 class="text-center sm:text-left break-words">
            {{ title }}
          </h3>
          <h5 class="text-center sm:text-left text-xs opacity-75 break-words leading-relaxed mt-0.5">
            {{ subtitle }}
          </h5>
        </div>
        <div
          v-if="exportable && rows.length > 0"
          class="flex justify-center sm:justify-end gap-1 shrink-0"
        >
          <base-button
            :id="elementIds.BTN_EXPORT_SCHEDULE_CSV"
            class="btn-xs btn-outline"
            title="Download amortization schedule as CSV"
            @click="handleExportCsv"
          >
            Export CSV
          </base-button>
          <base-button
            :id="elementIds.BTN_EXPORT_SCHEDULE_JSON"
            class="btn-xs btn-outline"
            title="Download amortization schedule as JSON"
            @click="handleExportJson"
          >
            Export JSON
          </base-button>
        </div>
      </div>
    </header>
    <div :class="['justifyCenter', 'max-h-90', 'overflow-y-auto', 'overflow-x-auto']">
      <base-table :class="['table-sm']">
        <template #header>
          <thead>
            <tr>
              <th
                v-for="header in headers"
                :key="header.key"
                :class="header.class || 'text-right'"
              >
                {{ header.label }}
              </th>
            </tr>
          </thead>
        </template>
        <template #body>
          <tbody>
            <tr
              v-for="(row, index) in rows"
              :key="index"
            >
              <td
                v-for="header in headers"
                :key="header.key"
                :class="header.class || 'text-right'"
              >
                {{ row[header.key] }}
              </td>
            </tr>
          </tbody>
        </template>
        <template #footer>
          <tfoot>
            <tr>
              <td
                v-for="header in headers"
                :key="header.key"
                :class="header.class || 'text-right'"
              >
                <b>{{ totals[header.key] }}</b>
              </td>
            </tr>
          </tfoot>
        </template>
      </base-table>
    </div>
  </div>
</template>
