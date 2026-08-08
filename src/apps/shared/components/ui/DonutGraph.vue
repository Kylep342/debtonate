<script setup lang="ts">
import * as d3 from 'd3';
import { onMounted, shallowReactive, watch, ShallowReactive } from 'vue';

import { Arc, GraphConfig } from '@/apps/shared/types/graph';

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
  }
});

const elId = `donut-graph-${props.anchorId}`;

const chart: ShallowReactive<GraphConfig> = shallowReactive({});

const initializeChart = () => {
  const width = 300;
  const height = 300;
  const margin = 40;
  const radius = Math.min(width, height) / 2 - margin;

  const svg = d3.select(`#${elId}`)
    .html("")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const color = d3.scaleOrdinal()
    .domain(props.graph.map(d => d.label))
    .range(d3.schemeCategory10);

  const pie = d3.pie<Arc>()
    .sort(null)
    .value(d => d.value);

  const arc = d3.arc<d3.PieArcDatum<Arc>>()
    .innerRadius(radius * 0.5)
    .outerRadius(radius);

  svg.selectAll("path")
    .data(pie(props.graph))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", d => d.data.color || color(d.data.label))
    .style("stroke-width", "2px")
    .style("opacity", 0.8)
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
  <div class="flex justify-center w-full min-w-0 overflow-hidden my-2">
    <svg :id="elId" viewBox="0 0 300 300" class="w-full max-w-[180px] h-auto max-h-[180px]"></svg>
  </div>
</template>

<style scoped>
svg {
  display: block;
}
</style>
