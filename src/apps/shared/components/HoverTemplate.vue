<script setup lang="ts">
import { onUpdated, ref } from 'vue';

import { TooltipConfig } from '../types/graph';

const props = defineProps<{
  tooltipConfig: TooltipConfig,
  index: number,
  updateTooltipSize: Function,
}>();

const templateRef = ref(null);

onUpdated(() => {
  const rect = templateRef.value.getBoundingClientRect();
  props.updateTooltipSize({ width: rect.width, height: rect.height });
})
</script>

<template>
  <base-table ref="templateRef" :class="['table-xs']">
    <template #header>
      <thead>
        <tr :class="['bg-transparent']">
          <th>Color</th>
          <th>{{ tooltipConfig.xLabel }}</th>
          <th :class="['text-right']">
            {{ tooltipConfig.xFormat(index) }}
          </th>
        </tr>
      </thead>
    </template>
    <template #body>
      <tbody>
        <tr v-for="(line, id) in tooltipConfig.lines" :key="id">
          <td>
            <svg width="10" height="10">
              <circle cx="5" cy="5" r="5" :fill="tooltipConfig.color(id)" />
            </svg>
          </td>
          <td>{{ tooltipConfig.lineName(id) }}</td>
          <td :class="['text-right']">
            {{
              tooltipConfig.yFormat(
                line[Math.min(index - 1, line.length - 1)].y
              )
            }}
          </td>
        </tr>
      </tbody>
    </template>
  </base-table>
</template>
