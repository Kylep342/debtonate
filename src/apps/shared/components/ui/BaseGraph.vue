<script setup lang="ts">
import * as d3 from 'd3';
import {
  onMounted, ref, shallowReactive, shallowRef, watch,
} from 'vue';

import HoverTemplate from '@/apps/shared/components/HoverTemplate.vue';
import { smartPosition } from '@/apps/shared/functions/viewport';
import { GraphConfig, TooltipConfig } from '@/apps/shared/types/graph';

type TooltipProps = {
  TooltipConfig,
  index: number,
  updateTooltipSize: (size: number) => void,
}

const props = defineProps<{
  graph: GraphConfig,
  anchorId: string
}>();

const chart = shallowReactive(<GraphConfig>{});
const tooltipContent = shallowRef<HoverTemplate>(null);
const tooltipPosition = ref({ left: 0, top: 0 });
const tooltipProps = ref<TooltipProps|null>(null);
const tooltipRef = ref(null);
const tooltipSize = ref({ width: 0, height: 0 });

const updateTooltipSize = (size) => {
  tooltipSize.value = size;
};

const initializeChart = () => {
  const graph = chart.graphs[props.anchorId];
  const totalWidth = 800;
  const totalHeight = 500;

  const margin = { top: 20, right: 20, bottom: 40, left: 80 };

  const innerWidth = totalWidth - margin.left - margin.right;
  const innerHeight = totalHeight - margin.top - margin.bottom;

  const svg = d3.select('#graph').attr('width', totalWidth).attr('height', totalHeight);

  svg.selectAll('*').remove();

  // Create a group element that will contain the chart, translated by the margin.
  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const x = chart.xScale()
    .domain([chart.x(0), chart.x(graph.config.maxX)])
    .range([0, innerWidth]);

  const y = chart.yScale()
    .domain([chart.y(0), chart.y(graph.config.maxY * 1.1)])
    .range([innerHeight, 0]);

  const draw = d3.line()
    .x((point) => x(chart.x(point.x)))
    .y((point) => y(chart.y(point.y)));

  g.append('g')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x).ticks(innerWidth / 80).tickSizeOuter(0));

  g.append('g')
    .call(d3.axisLeft(y).ticks(innerHeight / 40).tickFormat(chart.yFormat))
    .call((g) => g.select('.domain').remove())
    .call((g) => g.selectAll('.tick line').clone()
      .attr('x2', innerWidth)
      .attr('stroke-opacity', 0.1));

  Object.entries(graph.lines).forEach(([id, line]) => {
    g.append('path')
      .datum(line)
      .attr('fill', 'none')
      .attr('stroke', chart.color(id))
      .attr('stroke-width', 1.5)
      .attr('d', draw);

    line.forEach((point) => {
      g.append('circle')
        .attr('cx', x(chart.x(point.x)))
        .attr('cy', y(chart.y(point.y)))
        .attr('r', 4)
        .style('opacity', 0)
        .attr('fill', chart.color(id))
        .on('mouseover', (event) => {
          tooltipPosition.value = smartPosition(tooltipRef, event.x, event.y);
          tooltipContent.value = HoverTemplate;
          tooltipProps.value = {
            tooltipConfig: <TooltipConfig>{
              xLabel: chart.xLabel(),
              xFormat: chart.xFormat,
              lines: graph.lines,
              color: chart.color,
              lineName: chart.lineName,
              yFormat: chart.yFormat,
            },
            index: point.x,
            updateTooltipSize,
          };
        })
        .on('mouseout', () => {
          tooltipContent.value = null;
        });
    });
  });
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
  <div class="chartWrapper">
    <h2 class="text-center">
      {{ chart.header(anchorId) }}
    </h2>
    <h2 class="text-center">
      {{ chart.subheader(anchorId) }}
    </h2>
    <svg id="graph" />
    <div id="tooltip" ref="tooltipRef" :style="{
      left: tooltipPosition.left + 'px',
      top: tooltipPosition.top + 'px',
      opacity: tooltipContent ? 1 : 0
    }">
      <component :is="tooltipContent" v-bind="tooltipProps" />
    </div>
  </div>
</template>

<style>
#tooltip {
  pointer-events: none;
  position: absolute;
  transition: transform 0.1s ease;
}
</style>
