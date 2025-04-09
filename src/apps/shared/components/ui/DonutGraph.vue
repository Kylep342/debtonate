<script setup lang="ts">
import * as d3 from 'd3';
import {
  onMounted, ref, shallowReactive, shallowRef, watch,
} from 'vue';

import HoverTemplate from '@/apps/shared/components/HoverTemplate.vue';
import { smartPosition } from '@/apps/shared/functions/viewport';
import { GraphConfig, TooltipConfig } from '@/apps/shared/types/graph';

const props = defineProps<{
  data: Object,
  anchorId: string
}>();

const elId = `donut-graph-${props.anchorId}`;

const chart = shallowReactive(<GraphConfig>{});
const tooltipContent = shallowRef(null);
const tooltipPosition = ref({ left: 0, top: 0 });
const tooltipProps = ref(null);
const tooltipRef = ref(null);
const tooltipSize = ref({ width: 0, height: 0 });

const updateTooltipSize = (size) => {
  tooltipSize.value = size;
};

const initializeChart = () => {
  const width = 300;
  const height = 300;
  const margin = 40;
  const radius = Math.min(width, height) / 2 - margin;

  const svg = d3.select(`#${elId}`)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const color = d3.scaleOrdinal()
    .domain(props.data.map(d => d.label))
    .range(d3.schemeCategory10);

  const pie = d3.pie()
    .sort(null)
    .value(d => d.value);

  const arc = d3.arc()
    .innerRadius(radius * 0.5)
    .outerRadius(radius);

  svg.selectAll("path")
    .data(pie(props.data))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", d => color(d.data.label))
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.8);
}

onMounted(() => {
  if (props.data) {
    Object.assign(chart, props.data);
    initializeChart();
  }
});

watch(
  () => props.data,
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
  <div>
    <h1>Summary - {{ anchorId }}</h1>
    <svg :id="elId" width="300" height="300"></svg>
  </div>
</template>

<style>
{
  pointer-events: none;
  position: absolute;
  transition: transform 0.1s ease;
}
</style>