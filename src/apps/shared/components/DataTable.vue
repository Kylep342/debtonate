<script setup lang="ts">
import { TableHeader } from '@/apps/shared/types/app';
import elementIds from '@/apps/shared/constants/elementIds';
import { exportToCsv, exportToJson, computeStateHash } from '@/apps/shared/functions/export';

const props = withDefaults(
  defineProps<{
    title: string;
    subtitle: string;
    headers: TableHeader[];
    rows: Record<string, string>[];
    totals: Record<string, string>;
    exportable?: boolean;
    stateHash?: string;
  }>(),
  {
    exportable: true,
    stateHash: '',
  }
);

const slugify = (text: string): string =>
  (text || 'schedule')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const getExportFilename = (): string => {
  const base = slugify(props.title);
  const hash = props.stateHash || computeStateHash({
    title: props.title,
    headers: props.headers,
    rows: props.rows,
    totals: props.totals,
  });
  return `${base}_${hash}`;
};

const handleExportCsv = (): void => {
  const filename = getExportFilename();
  exportToCsv(filename, props.headers, props.rows, props.totals);
};

const handleExportJson = (): void => {
  const filename = getExportFilename();
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
  <div class="card bg-base-100 border border-base-content/10 shadow-sm rounded-2xl p-3 sm:p-5 flex flex-col gap-3.5 flex-1 min-h-0">
    <!-- Header with Title, Subtitle, and Controls -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-base-content/10 pb-3 shrink-0">
      <div>
        <h3 class="text-base sm:text-lg font-bold text-base-content tracking-tight">
          {{ title }}
        </h3>
        <p
          v-if="subtitle"
          class="text-xs text-base-content/60 mt-0.5"
        >
          {{ subtitle }}
        </p>
      </div>
      <div
        v-if="exportable && rows.length > 0"
        class="flex items-center gap-1 shrink-0"
      >
        <base-button
          :id="elementIds.BTN_EXPORT_SCHEDULE_CSV"
          class="btn-xs btn-outline"
          title="Download amortization schedule as CSV"
          @click="handleExportCsv"
        >
          CSV
        </base-button>
        <base-button
          :id="elementIds.BTN_EXPORT_SCHEDULE_JSON"
          class="btn-xs btn-outline"
          title="Download amortization schedule as JSON"
          @click="handleExportJson"
        >
          JSON
        </base-button>
      </div>
    </div>
    <div :class="['justifyCenter', 'flex-1', 'min-h-0', 'overflow-y-auto', 'overflow-x-auto', 'rounded-xl', 'border', 'border-base-content/10']">
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
