<script setup lang="ts">
import * as d3 from 'd3';
import { onMounted, shallowReactive, watch } from 'vue';

import { Arc } from '@/apps/shared/types/graph';

const props = defineProps({
  config: {
    type: Object,
    required: true
  },
  graph: {
    type: Array as () => Arc[],
    required: true
  },
  anchorId: {
    type: String,
    required: true
  },
  centerLabel: {
    type: String,
    default: ''
  },
  centerValue: {
    type: String,
    default: ''
  },
  compact: {
    type: Boolean,
    default: true
  }
});

const elId = `donut-graph-${props.anchorId}`;

const chart = shallowReactive<Record<string, any>>({});

const initializeChart = () => {
  const width = 220;
  const height = 220;
  const margin = 12;
  const radius = Math.min(width, height) / 2 - margin;

  const svg = d3.select(`#${elId}`)
    .html('')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .append('g')
    .attr('transform', `translate(${width / 2}, ${height / 2})`);

  const color = d3.scaleOrdinal()
    .domain(props.graph.map(d => d.label))
    .range(d3.schemeCategory10);

  const pie = d3.pie<Arc>()
    .sort(null)
    .value(d => d.value);

  const positiveSlices = props.graph.filter(d => Number(d.value) > 0).length;

  const arc = d3.arc<d3.PieArcDatum<Arc>>()
    .innerRadius(radius * 0.62)
    .outerRadius(radius)
    .cornerRadius(positiveSlices > 1 ? 3 : 0)
    .padAngle(positiveSlices > 1 ? 0.02 : 0);

  svg.selectAll('path')
    .data(pie(props.graph))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', (d: any) => d.data.color || (color(d.data.label) as string))
    .style('stroke-width', '1.5px')
    .style('opacity', 0.88);
};

onMounted(() => {
  if (props.graph) {
    Object.assign(chart, props.graph);
    initializeChart();
  }
});

watch(
  () => props.graph,
  (value) => {
    if (value) {
      Object.assign(chart, value);
      initializeChart();
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="relative flex items-center justify-center w-full min-w-0 overflow-hidden my-1">
    <svg
      :id="elId"
      viewBox="0 0 220 220"
      :class="[
        'w-full h-auto',
        compact ? 'max-w-[136px] max-h-[136px]' : 'max-w-[180px] max-h-[180px]'
      ]"
    />
    <div
      v-if="centerLabel || centerValue"
      class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center px-4"
    >
      <span
        v-if="centerLabel"
        class="donut-center-label text-[9px] uppercase tracking-wider font-semibold text-base-content/55 leading-tight truncate max-w-[78px]"
      >
        {{ centerLabel }}
      </span>
      <span
        v-if="centerValue"
        class="donut-center-value font-mono font-bold text-xs text-base-content leading-tight mt-0.5 truncate max-w-[84px]"
      >
        {{ centerValue }}
      </span>
    </div>
  </div>
</template>

<style scoped>
svg {
  display: block;
}
</style>

