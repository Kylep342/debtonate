<script setup lang="ts">
import { getActivePinia } from 'pinia';
import { computed, ref, ComputedRef, Ref } from 'vue';

import ColorDot from '@/apps/shared/components/ColorDot.vue';
import BaseButton from '@/apps/shared/components/ui/BaseButton.vue';
import BaseCard from '@/apps/shared/components/ui/BaseCard.vue';
import BaseMenu from '@/apps/shared/components/ui/BaseMenu.vue';
import BaseTable from '@/apps/shared/components/ui/BaseTable.vue';
import DonutGraph from '@/apps/shared/components/ui/DonutGraph.vue';
import elementIds from '@/apps/shared/constants/elementIds';
import { useGlobalOptionsStore } from '@/apps/shared/stores/globalOptions';
import { Button, CardBadge, CardMetricRow } from '@/apps/shared/types/app';
import { Arc } from '@/apps/shared/types/graph';

const props = withDefaults(
  defineProps<{
    anchorId: string;
    title: string;
    subtitle?: string;
    badge?: CardBadge | null;
    isBaseline?: boolean;
    menuText?: string;
    menuButtons: Button[];
    showGraph?: boolean;
    graphHeader?: string;
    graphConfig?: Record<string, any>;
    graphContent?: Arc[];
    donutCenterLabel?: string;
    donutCenterValue?: string;
    metrics?: CardMetricRow[];
    collapsible?: boolean;
  }>(),
  {
    subtitle: '',
    badge: null,
    isBaseline: false,
    menuText: 'Menu',
    showGraph: false,
    graphHeader: '',
    graphConfig: () => ({}),
    graphContent: () => [],
    donutCenterLabel: '',
    donutCenterValue: '',
    metrics: () => [],
    collapsible: true,
  }
);

const globalOptions = getActivePinia() ? useGlobalOptionsStore() : null;


const formatMoney = (value: number | bigint): string => {
  if (globalOptions && typeof globalOptions.Money === 'function') {
    const formatted = globalOptions.Money(value);
    if (formatted !== undefined) return formatted;
  }
  return `$${Number(value).toLocaleString()}`;
};

const isCollapsed: Ref<boolean> = ref(false);

const toggleCollapse = (): void => {
  isCollapsed.value = !isCollapsed.value;
};

const collapse = (): void => {
  isCollapsed.value = true;
};

const expand = (): void => {
  isCollapsed.value = false;
};

defineExpose({
  isCollapsed,
  toggleCollapse,
  collapse,
  expand,
});

const safeGraphContent: ComputedRef<Arc[]> = computed(() =>
  Array.isArray(props.graphContent) ? props.graphContent : []
);

const totalGraphValue: ComputedRef<number> = computed(() =>
  safeGraphContent.value.reduce((sum, item) => sum + (Number(item?.value) || 0), 0)
);

const graphShares = computed(() => {
  if (totalGraphValue.value <= 0) return [];
  return safeGraphContent.value
    .filter((item) => Number(item?.value) > 0)
    .map((item) => {
      const pct = (Number(item.value) / totalGraphValue.value) * 100;
      return {
        label: item.label,
        color: item.color || 'currentColor',
        percent: Math.max(2, Math.round(pct)),
        percentFormatted: `${Math.round(pct)}%`,
      };
    });
});

const getSliceShareText = (value: number): string | null => {
  if (totalGraphValue.value <= 0) return null;
  const num = Number(value) || 0;
  if (num <= 0) return '0%';
  return `${Math.round((num / totalGraphValue.value) * 100)}%`;
};

const resolvedCenterLabel: ComputedRef<string> = computed(() => {
  if (props.donutCenterLabel) return props.donutCenterLabel;
  if (totalGraphValue.value > 0 && safeGraphContent.value.length > 0) {
    return safeGraphContent.value[0].label.replace(/^Lifetime\s+/i, '');
  }
  return '';
});

const resolvedCenterValue: ComputedRef<string> = computed(() => {
  if (props.donutCenterValue) return props.donutCenterValue;
  if (totalGraphValue.value > 0 && safeGraphContent.value.length > 0) {
    return getSliceShareText(safeGraphContent.value[0].value) || '';
  }
  return '';
});
</script>

<template>
  <base-card
    :class="[
      'summary-card',
      'w-full',
      'min-w-0',
      'max-w-full',
      'rounded-xl',
      'border',
      'transition-all',
      'duration-200',
      isBaseline
        ? 'bg-base-200/35 border-primary/25 shadow-sm'
        : 'bg-base-100 border-base-content/10 shadow-xs hover:border-base-content/20 hover:shadow-sm',
    ]"
    :body-classes="isCollapsed ? ['hidden'] : ['p-3', 'pt-2.5', 'overflow-hidden', 'w-full', 'max-w-full', 'gap-1.5']"
  >
    <template #cardTitle>
      <div
        :class="[
          'card-actions',
          'flow-root',
          'w-full',
          'min-w-0',
          'px-3',
          'py-2',
          !isCollapsed ? 'border-b border-base-content/10' : '',
          isBaseline ? 'bg-primary/5 rounded-t-xl' : 'bg-base-200/25 rounded-t-xl',
          isCollapsed ? 'rounded-b-xl' : '',
        ]"
      >
        <div class="flex justify-between items-center gap-1.5 min-w-0">
          <div class="flex flex-col min-w-0 flex-1">
            <div class="flex items-center gap-1.5 min-w-0 truncate">
              <h2 :class="['cardHeaderTitle', 'truncate', 'min-w-0', 'font-bold', 'text-sm', 'sm:text-base', 'tracking-tight', 'text-base-content']">
                {{ title }}
              </h2>
              <span
                v-if="badge && badge.text"
                :class="['badge badge-xs sm:badge-sm font-semibold text-[11px] shrink-0', badge.badgeClass || 'badge-success']"
              >
                {{ badge.text }}
              </span>
            </div>
            <p
              v-if="subtitle"
              class="cardHeaderSubtitle text-[11px] font-mono text-base-content/60 truncate leading-tight mt-0.5"
            >
              {{ subtitle }}
            </p>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <base-button
              v-if="collapsible"
              :id="`${elementIds.BTN_CARD_COLLAPSE_PREFIX}-${anchorId}`"
              :class="['btn-ghost', 'btn-xs', 'btn-square', 'font-mono', 'text-base-content/60', 'hover:text-base-content']"
              :title="isCollapsed ? 'Expand card' : 'Collapse card'"
              @click="toggleCollapse"
            >
              {{ isCollapsed ? '+' : '-' }}
            </base-button>
            <base-menu
              :text="menuText"
              :buttons="menuButtons"
              :classes="['btn-xs', 'sm:btn-sm', 'btn-outline', 'border-base-content/20']"
            />
          </div>
        </div>
      </div>
    </template>

    <template
      v-if="!isCollapsed"
      #cardBody
    >
      <div
        v-if="showGraph"
        class="bg-base-200/30 rounded-lg p-2 border border-base-content/5 mb-1"
      >
        <h3
          v-if="graphHeader"
          class="text-center font-semibold text-xs text-base-content/75 truncate mb-0.5"
        >
          {{ graphHeader }}
        </h3>
        <donut-graph
          :config="graphConfig"
          :graph="safeGraphContent"
          :anchor-id="anchorId"
          :center-label="resolvedCenterLabel"
          :center-value="resolvedCenterValue"
        />
        <div
          v-if="graphShares.length > 0"
          class="composition-bar w-full bg-base-300/60 rounded-full h-1.5 overflow-hidden flex mt-1"
        >
          <div
            v-for="slice in graphShares"
            :key="slice.label"
            class="h-full transition-all duration-300"
            :style="{ width: `${slice.percent}%`, backgroundColor: slice.color }"
            :title="`${slice.label}: ${slice.percentFormatted}`"
          />
        </div>
      </div>

      <base-table :class="['table-xs', 'w-full', 'max-w-full']">
        <template #body>
          <tbody>
            <template v-if="showGraph && safeGraphContent.length">
              <tr
                v-for="datum in safeGraphContent"
                :key="datum.label"
                class="border-b border-base-content/5"
              >
                <td class="truncate max-w-[120px] text-xs text-base-content/80">
                  <ColorDot :color="datum.color || ''" />{{ datum.label }}
                </td>
                <td :class="['text-right', 'whitespace-nowrap', 'text-xs']">
                  <span
                    v-if="getSliceShareText(datum.value)"
                    class="badge badge-ghost badge-xs font-mono text-[10px] text-base-content/60 mr-1.5"
                  >{{ getSliceShareText(datum.value) }}</span>{{ ' ' }}<b class="font-mono text-base-content">{{ formatMoney(datum.value) }}</b>
                </td>
              </tr>
            </template>

            <tr
              v-for="row in metrics"
              :key="row.label"
              :class="[
                'border-b border-base-content/5 last:border-b-0 transition-colors hover:bg-base-200/30',
                row.rowClass || '',
              ]"
            >
              <td
                :class="['truncate', 'max-w-[120px]', 'text-xs', row.labelClass || 'text-base-content/75']"
                :title="row.tooltip || row.label"
              >
                {{ row.label }}
              </td>
              <td
                :class="[
                  'text-right',
                  'whitespace-nowrap',
                  'text-xs',
                  row.badge ? 'flex items-center justify-end gap-1' : '',
                ]"
              >
                <b :class="['font-mono', row.valueClass || 'text-base-content']">{{ row.value }}</b>
                <span
                  v-if="row.badge"
                  :class="['badge', 'badge-xs', row.badge.badgeClass, 'font-semibold', 'text-[10px]']"
                >
                  {{ row.badge.text }}
                </span>
              </td>
            </tr>
            <slot name="extraRows" />
          </tbody>
        </template>
      </base-table>
    </template>
  </base-card>
</template>
