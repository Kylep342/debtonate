<script setup lang="ts">
import { onMounted, onUpdated, ref } from 'vue';
import { TooltipConfig, TooltipSize } from '@/apps/shared/types/graph';

const props = defineProps<{
  tooltipConfig: TooltipConfig;
  index: number;
  updateTooltipSize?: (size: TooltipSize) => void;
}>();

const templateRef = ref<HTMLElement | null>(null);

const reportSize = () => {
  if (templateRef.value && props.updateTooltipSize) {
    const rect = templateRef.value.getBoundingClientRect();
    props.updateTooltipSize({ width: rect.width, height: rect.height });
  }
};

const getPointVal = (line: any[]) => {
  if (!line || line.length === 0) return 0;
  const minX = props.tooltipConfig.minX || 0;
  const idx = Math.max(0, Math.min(props.index - minX, line.length - 1));
  return line[idx]?.y ?? 0;
};

onMounted(reportSize);
onUpdated(reportSize);
</script>

<template>
  <div
    ref="templateRef"
    class="bg-base-200/95 backdrop-blur-md border border-base-content/15 shadow-2xl rounded-xl p-3 text-xs text-base-content min-w-48 max-w-xs pointer-events-none"
  >
    <div class="flex items-center justify-between border-b border-base-content/10 pb-1.5 mb-2">
      <span class="font-semibold text-[11px] text-base-content/70">{{ tooltipConfig.xLabel }}</span>
      <span class="badge badge-xs badge-primary font-mono font-bold">{{ tooltipConfig.xFormat(index) }}</span>
    </div>
    <table class="table table-xs w-full">
      <tbody>
        <tr
          v-for="(line, id) in tooltipConfig.lines"
          :key="id"
          class="border-b border-base-content/5"
        >
          <td class="p-1 w-4">
            <span
              class="inline-block w-2.5 h-2.5 rounded-full"
              :style="{ backgroundColor: tooltipConfig.color(id) }"
            />
          </td>
          <td class="p-1 font-medium truncate max-w-[120px]">
            {{ tooltipConfig.lineName(id) }}
          </td>
          <td class="p-1 text-right font-mono font-bold">
            {{ tooltipConfig.yFormat(getPointVal(line)) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
