<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { exportToCsv, exportToJson, CsvHeader } from '@/apps/shared/functions/export';

const props = withDefaults(
  defineProps<{
    analysis: Record<string, Record<string, any>>;
    items: any[]; // budgets or loans/scenarios
    title: string;
    getItemName: (id: string) => string;
    subtitle?: string;
    exportable?: boolean;
    baselineId?: string | null;
    showSummaryCards?: boolean;
  }>(),
  {
    subtitle: '',
    exportable: true,
    baselineId: null,
    showSummaryCards: true,
  }
);

const emit = defineEmits<{
  (e: 'selectBaseline', id: string): void;
}>();

const showDeltas = ref(Boolean(props.baselineId));

watch(
  () => props.baselineId,
  (newBaseline) => {
    if (newBaseline) {
      showDeltas.value = true;
    }
  },
  { immediate: true }
);

const metrics = computed(() => Object.keys(props.analysis || {}));

// Parse numeric value for statistical and visual comparison (supports US and European formats)
const parseNumeric = (val: any): number | null => {
  if (val === null || val === undefined || val === '-') return null;
  if (typeof val === 'number') return isNaN(val) ? null : val;
  if (typeof val === 'string') {
    // Strip currency symbols, percent signs, and whitespace
    let str = val.replace(/[$€£¥₹\s%]/g, '').trim();
    if (!str) return null;

    const hasDot = str.includes('.');
    const hasComma = str.includes(',');

    if (hasDot && hasComma) {
      if (str.lastIndexOf('.') < str.lastIndexOf(',')) {
        // Dot is thousands, comma is decimal (e.g. 216.413,23)
        str = str.replace(/\./g, '').replace(',', '.');
      } else {
        // Comma is thousands, dot is decimal (e.g. 216,413.23)
        str = str.replace(/,/g, '');
      }
    } else if (hasComma) {
      // Only comma: e.g. 2000,00 or 480,82 or 1,234,567
      if (/,\d{1,2}$/.test(str)) {
        str = str.replace(',', '.');
      } else {
        str = str.replace(/,/g, '');
      }
    } else if (hasDot) {
      // Multiple dots or single dot without decimals: e.g. 1.234.567
      if (!/\.\d{1,2}$/.test(str) && (str.match(/\./g) || []).length > 1) {
        str = str.replace(/\./g, '');
      }
    }

    const num = parseFloat(str);
    return isNaN(num) ? null : num;
  }
  return null;
};

// Determines whether lower value is preferable
const isLowerBetter = (metric: string): boolean => {
  const m = metric.toLowerCase();
  if (m.includes('interest') && !m.includes('growth')) return true;
  if (
    m.includes('fee')
    || m.includes('cost')
    || m.includes('payoff')
    || m.includes('period')
    || m.includes('rate')
    || m.includes('debt')
  ) {
    return true;
  }
  if (
    m.includes('growth')
    || m.includes('balance')
    || m.includes('saved')
    || m.includes('factor')
    || m.includes('return')
  ) {
    return false;
  }
  return false;
};

// Row-level stats: min, max, bestId
const rowStats = computed(() => {
  const stats: Record<string, { min: number; max: number; bestId: string | null; allNumeric: boolean }> = {};
  metrics.value.forEach((metric) => {
    let min = Infinity;
    let max = -Infinity;
    let bestId: string | null = null;
    let numericCount = 0;
    const lowerIsBetter = isLowerBetter(metric);

    props.items.forEach((item) => {
      const rawVal = props.analysis[metric]?.[item.id];
      const num = parseNumeric(rawVal);
      if (num !== null) {
        numericCount += 1;
        if (num < min) min = num;
        if (num > max) max = num;
      }
    });

    if (numericCount >= 2 && min !== max) {
      props.items.forEach((item) => {
        const num = parseNumeric(props.analysis[metric]?.[item.id]);
        if (num !== null) {
          if (lowerIsBetter && num === min) bestId = item.id;
          if (!lowerIsBetter && num === max) bestId = item.id;
        }
      });
    }

    stats[metric] = {
      min: isFinite(min) ? min : 0,
      max: isFinite(max) ? max : 0,
      bestId,
      allNumeric: numericCount >= 2 && min !== max,
    };
  });
  return stats;
});

// Relative percentage width for the visual mini-bar (15% to 100%)
const getBarPercent = (metric: string, itemId: string): number => {
  const stat = rowStats.value[metric];
  if (!stat || !stat.allNumeric || stat.max === stat.min) return 0;
  const val = parseNumeric(props.analysis[metric]?.[itemId]);
  if (val === null) return 0;
  const ratio = (val - stat.min) / (stat.max - stat.min);
  return Math.round(15 + ratio * 85);
};

// Delta calculation vs baseline item
const effectiveBaselineId = computed(() => props.baselineId || props.items[0]?.id);

// Sort items so that the selected baseline item appears first (as the reference column)
const displayItems = computed(() => {
  if (!props.baselineId) return props.items;
  const baselineItem = props.items.find((i) => i.id === props.baselineId);
  if (!baselineItem) return props.items;
  const otherItems = props.items.filter((i) => i.id !== props.baselineId);
  return [baselineItem, ...otherItems];
});

const getDeltaInfo = (metric: string, itemId: string): { text: string; isPositive: boolean; isImprovement: boolean } | null => {
  if (itemId === effectiveBaselineId.value) return null;
  const baseRaw = props.analysis[metric]?.[effectiveBaselineId.value];
  const itemRaw = props.analysis[metric]?.[itemId];
  const baseNum = parseNumeric(baseRaw);
  const itemNum = parseNumeric(itemRaw);
  if (baseNum === null || itemNum === null || baseNum === 0) return null;

  const diff = itemNum - baseNum;
  if (Math.abs(diff) < 0.0001) return null;

  const pctDiff = (diff / Math.abs(baseNum)) * 100;
  const lowerBetter = isLowerBetter(metric);
  const isImprovement = lowerBetter ? diff < 0 : diff > 0;

  // Format diff
  let formattedDiff = '';
  if (typeof itemRaw === 'string' && /[$€£¥₹]/.test(itemRaw)) {
    const symbol = itemRaw.match(/[$€£¥₹]/)?.[0] || '$';
    const isSymbolAtEnd = new RegExp(`\\s*\\${symbol}\\s*$`).test(itemRaw);
    const fractionDigits = Math.abs(diff) % 1 === 0 ? 0 : 2;
    const absDiff = Math.abs(diff).toLocaleString(undefined, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
    const sign = diff > 0 ? '+' : '-';
    formattedDiff = isSymbolAtEnd ? `${sign}${absDiff} ${symbol}` : `${sign}${symbol}${absDiff}`;
  } else if (typeof itemRaw === 'string' && itemRaw.includes('%')) {
    formattedDiff = `${diff > 0 ? '+' : ''}${diff.toFixed(2)}%`;
  } else {
    const fractionDigits = Math.abs(diff) % 1 === 0 ? 0 : 1;
    formattedDiff = `${diff > 0 ? '+' : ''}${diff.toFixed(fractionDigits)}`;
  }

  const pctStr = Math.abs(pctDiff) < 1 && Math.abs(pctDiff) > 0.05
    ? pctDiff.toFixed(1)
    : pctDiff.toFixed(0);

  return {
    text: `${formattedDiff} (${diff > 0 ? '+' : ''}${pctStr}%)`,
    isPositive: diff > 0,
    isImprovement,
  };
};

// Friendly definitions for common financial metrics
const metricTooltips: Record<string, string> = {
  'Total Principal': 'Total debt balance across all loans.',
  'Current Balance': 'Total remaining principal balance.',
  'Starting Balance': 'Initial account balance before contributions and compounding.',
  'Initial balance': 'Portfolio balance at the start of the retirement distribution phase.',
  'Initial Balance': 'Portfolio balance at the start of the retirement distribution phase.',
  'Interest Rate': 'Annual percentage rate (APR).',
  'Expected Return': 'Estimated annualized investment return.',
  'Total Interest': 'Total interest paid over the life of the loan. Lower is better.',
  'Interest': 'Cumulative compounding earnings accrued over time.',
  'Interest Growth': 'Cumulative compounding earnings accrued over time.',
  'Growth': 'Cumulative investment returns accrued.',
  'Growth in Retirement': 'Investment earnings accumulated while taking distributions.',
  'Total Fees': 'Origination and upfront fees associated with the scenario.',
  'Total Cost': 'Total money out of pocket: Principal + Interest + Fees.',
  'Total Payment': 'Total payments made over the full duration.',
  'Interest/Principal Ratio': 'Interest paid per dollar borrowed. Lower indicates higher efficiency.',
  'Interest/principal ratio': 'Ratio of investment growth to personal contributions.',
  'Growth/initial ratio': 'Ratio of investment returns earned during retirement to starting balance.',
  'Growth factor from present': 'Multiplier of total portfolio balance relative to your personal deposits.',
  'Growth factor from retirement start': 'Multiplier of final retirement balance relative to initial starting balance.',
  'Avg Monthly Payment': 'Monthly budget amount allocated.',
  'Principal Contributed': 'Total out-of-pocket money deposited into the portfolio.',
  'Periods to Payoff': 'Total months needed to pay off debt completely.',
  'Final Balance': 'Projected ending balance after accumulation or decumulation.',
  'Age of > $1M saved': 'Estimated age when total investment balance surpasses $1,000,000.',
  'Share of balance at retirement as principal': 'Percentage of retirement assets from personal contributions vs market returns.',
  'Share of value retirement end as growth': 'Percentage of remaining estate value generated by market returns.',
  'Effective avg saved/yr of work': 'Average annual contribution during your career.',
  'Effective avg saved/yr': 'Average annual compounding growth during retirement.',
};

// Summary highlights cards (for 2+ items)
const summaryHighlights = computed(() => {
  if (props.items.length < 2) return [];

  const cards: { label: string; winner: string; highlight: string; type: 'cost' | 'speed' | 'growth' }[] = [];

  // 1. Cost or Growth
  const costMetric = metrics.value.find((m) => m === 'Total Cost' || m === 'Total Interest');
  const growthMetric = metrics.value.find((m) => m === 'Final Balance' || m === 'Interest Growth' || m === 'Growth');

  if (costMetric && rowStats.value[costMetric]?.bestId) {
    const bestItem = props.items.find((i) => i.id === rowStats.value[costMetric].bestId);
    if (bestItem) {
      const bestVal = props.analysis[costMetric][bestItem.id];
      cards.push({
        label: `Lowest ${costMetric}`,
        winner: props.getItemName(bestItem.id),
        highlight: String(bestVal),
        type: 'cost',
      });
    }
  } else if (growthMetric && rowStats.value[growthMetric]?.bestId) {
    const bestItem = props.items.find((i) => i.id === rowStats.value[growthMetric].bestId);
    if (bestItem) {
      const bestVal = props.analysis[growthMetric][bestItem.id];
      cards.push({
        label: `Highest ${growthMetric}`,
        winner: props.getItemName(bestItem.id),
        highlight: String(bestVal),
        type: 'growth',
      });
    }
  }

  // 2. Payoff or Milestone Speed
  const timelineMetric = metrics.value.find((m) => m === 'Periods to Payoff' || m === 'Age of > $1M saved');
  if (timelineMetric && rowStats.value[timelineMetric]?.bestId) {
    const bestItem = props.items.find((i) => i.id === rowStats.value[timelineMetric].bestId);
    if (bestItem) {
      const bestVal = props.analysis[timelineMetric][bestItem.id];
      const unit = timelineMetric.includes('Periods') ? 'months' : 'years old';
      cards.push({
        label: timelineMetric === 'Periods to Payoff' ? 'Fastest Debt-Free' : 'Earliest $1M Milestone',
        winner: props.getItemName(bestItem.id),
        highlight: `${bestVal} ${unit}`,
        type: 'speed',
      });
    }
  }

  // 3. Efficiency / Multiplier
  const ratioMetric = metrics.value.find((m) => m.toLowerCase().includes('ratio') || m.toLowerCase().includes('factor'));
  if (ratioMetric && rowStats.value[ratioMetric]?.bestId) {
    const bestItem = props.items.find((i) => i.id === rowStats.value[ratioMetric].bestId);
    if (bestItem) {
      const bestVal = props.analysis[ratioMetric][bestItem.id];
      cards.push({
        label: `Best ${ratioMetric}`,
        winner: props.getItemName(bestItem.id),
        highlight: `${bestVal}x`,
        type: 'growth',
      });
    }
  }

  return cards;
});

// CSV and JSON export
const slugify = (text: string): string =>
  (text || 'comparative_analysis')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const handleExportCsv = (): void => {
  const filename = slugify(props.title);
  const headers: CsvHeader[] = [
    { key: 'metric', label: 'Metric' },
    ...displayItems.value.map((item) => ({
      key: item.id,
      label: props.getItemName(item.id),
    })),
  ];

  const rows = metrics.value.map((metric) => {
    const row: Record<string, any> = { metric };
    displayItems.value.forEach((item) => {
      row[item.id] = props.analysis[metric]?.[item.id] ?? '';
    });
    return row;
  });

  exportToCsv(filename, headers, rows);
};

const handleExportJson = (): void => {
  const filename = slugify(props.title);
  const headers: CsvHeader[] = [
    { key: 'metric', label: 'Metric' },
    ...displayItems.value.map((item) => ({
      key: item.id,
      label: props.getItemName(item.id),
    })),
  ];

  const rows = metrics.value.map((metric) => {
    const row: Record<string, any> = { metric };
    displayItems.value.forEach((item) => {
      row[item.id] = props.analysis[metric]?.[item.id] ?? '';
    });
    return row;
  });

  exportToJson(filename, {
    title: props.title,
    subtitle: props.subtitle,
    headers,
    rows,
    exportedAt: new Date().toISOString(),
  });
};
</script>

<template>
  <div class="card bg-base-100 border border-base-content/10 shadow-sm rounded-2xl p-3 sm:p-5 flex flex-col gap-3.5">
    <!-- Header with Title, Subtitle, and Controls -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-base-content/10 pb-3">
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
      <div class="flex flex-wrap items-center gap-1.5">
        <button
          v-if="items.length >= 2"
          type="button"
          class="btn btn-xs transition-all"
          :class="showDeltas ? 'btn-primary' : 'btn-outline border-base-content/20 text-base-content/70'"
          @click="showDeltas = !showDeltas"
        >
          {{ showDeltas ? 'Hide Deltas (Δ)' : 'Show Deltas (Δ)' }}
        </button>
        <div
          v-if="exportable && items.length > 0"
          class="flex items-center gap-1"
        >
          <button
            type="button"
            class="btn btn-xs btn-outline"
            @click="handleExportCsv"
          >
            CSV
          </button>
          <button
            type="button"
            class="btn btn-xs btn-outline"
            @click="handleExportJson"
          >
            JSON
          </button>
        </div>
      </div>
    </div>

    <!-- Summary Highlight Cards -->
    <div
      v-if="showSummaryCards && summaryHighlights.length > 0"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2"
    >
      <div
        v-for="card in summaryHighlights"
        :key="card.label"
        class="bg-base-200/50 rounded-xl p-2.5 border border-base-content/10 flex flex-col gap-1 shadow-xs"
      >
        <div class="flex items-center justify-between text-[11px] text-base-content/60">
          <span>{{ card.label }}</span>
          <span class="badge badge-xs badge-success uppercase font-semibold text-[9px] py-0 px-1.5">Optimal</span>
        </div>
        <div class="flex items-baseline justify-between mt-0.5">
          <span class="font-bold text-xs sm:text-sm text-base-content truncate">{{ card.winner }}</span>
          <span class="font-mono text-xs font-bold text-primary shrink-0">{{ card.highlight }}</span>
        </div>
      </div>
    </div>

    <!-- Dynamic Crosstab Table -->
    <div class="overflow-x-auto overflow-y-auto max-h-90 rounded-xl border border-base-content/10">
      <table class="table table-zebra table-pin-rows w-full text-xs sm:text-sm">
        <thead class="bg-base-200/60">
          <tr>
            <th class="w-1/3 min-w-[160px] text-left font-bold text-base-content">
              Metric
            </th>
            <th
              v-for="item in displayItems"
              :key="item.id"
              class="text-right min-w-[125px] font-bold text-base-content transition-colors cursor-pointer select-none"
              :class="{
                'bg-primary/10 border-b-2 border-primary': item.id === effectiveBaselineId && displayItems.length > 1,
                'hover:bg-base-300/40': item.id !== effectiveBaselineId,
              }"
              :title="item.id === effectiveBaselineId ? 'Current reference baseline' : 'Click to set as reference baseline'"
              @click="emit('selectBaseline', item.id)"
            >
              <div class="flex flex-col items-end gap-0.5">
                <span class="truncate max-w-[140px]">{{ getItemName(item.id) }}</span>
                <span
                  v-if="props.baselineId && item.id === props.baselineId && displayItems.length > 1"
                  class="badge badge-xs badge-primary uppercase font-bold text-[9px] tracking-wider py-0 px-1"
                >
                  Baseline
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="metric in metrics"
            :key="metric"
            class="hover:bg-base-200/40 transition-colors"
          >
            <td class="font-semibold text-base-content align-top">
              <div class="flex flex-col">
                <span class="font-medium">{{ metric }}</span>
                <span
                  v-if="metricTooltips[metric]"
                  class="text-[11px] font-normal text-base-content/50 leading-tight mt-0.5"
                >
                  {{ metricTooltips[metric] }}
                </span>
              </div>
            </td>
            <td
              v-for="item in displayItems"
              :key="item.id"
              class="text-right align-top transition-colors"
              :class="{
                'bg-success/5': rowStats[metric]?.bestId === item.id && item.id !== effectiveBaselineId,
                'bg-primary/5': item.id === effectiveBaselineId && displayItems.length > 1,
              }"
            >
              <div class="flex flex-col items-end">
                <div class="flex items-center gap-1 justify-end">
                  <span class="font-mono font-medium">{{ analysis[metric][item.id] }}</span>
                  <svg
                    v-if="rowStats[metric]?.bestId === item.id"
                    class="w-3 h-3 text-success shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    title="Best in row"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>

                <!-- Proportional Mini Comparison Bar -->
                <div
                  v-if="rowStats[metric]?.allNumeric"
                  class="w-full max-w-[90px] bg-base-300/60 rounded-full h-1 mt-1 overflow-hidden"
                >
                  <div
                    class="h-full rounded-full transition-all duration-300"
                    :class="rowStats[metric]?.bestId === item.id ? 'bg-success' : 'bg-primary/70'"
                    :style="{ width: `${getBarPercent(metric, item.id)}%` }"
                  />
                </div>

                <!-- Delta Display -->
                <div
                  v-if="showDeltas && item.id !== effectiveBaselineId && getDeltaInfo(metric, item.id)"
                  class="text-[10px] font-mono mt-1 font-semibold flex items-center gap-0.5 justify-end"
                  :class="getDeltaInfo(metric, item.id)?.isImprovement ? 'text-success' : 'text-error'"
                >
                  <span>{{ getDeltaInfo(metric, item.id)?.text }}</span>
                </div>
                <div
                  v-else-if="showDeltas && props.baselineId && item.id === props.baselineId && displayItems.length > 1 && rowStats[metric]?.allNumeric"
                  class="text-[10px] font-mono mt-1 text-base-content/40 uppercase tracking-wider"
                >
                  baseline
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
