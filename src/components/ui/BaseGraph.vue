<script setup lang="ts">
import * as d3 from 'd3';
import {
  onMounted, ref, shallowReactive, shallowRef, watch,
} from 'vue';

import HoverTemplate from '@/components/HoverTemplate.vue';
import { smartPosition } from '@/functions/viewport';
import { GraphConfig, TooltipConfig } from '@/types/graph';

const props = defineProps<{
  graph: GraphConfig,
  anchorId: string
}>();

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
  const graph = chart.graphs[props.anchorId];
  const width = 800;
  const height = 500;
  const margin = 50;
  const svg = d3.select('#graph').attr('width', width).attr('height', height);

  svg.selectAll('*').remove();

  const x = chart.xScale()
    .domain([chart.x(0), chart.x(graph.config.maxX)])
    .range([0, width - margin * 2]);

  const y = chart.yScale()
    .domain([chart.y(0), chart.y(graph.config.maxY * 1.1)])
    .range([height - margin, 0]);

  const draw = d3.line()
    .x((point) => x(chart.x(point.x)))
    .y((point) => y(chart.y(point.y)));

  svg.append('g')
    .attr('transform', `translate(${margin},${height - margin})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

  svg.append('g')
    .attr('transform', `translate(${margin},0)`)
    .call(d3.axisLeft(y).ticks(height / 40))
    .call((g) => g.select('.domain').remove())
    .call((g) => g.selectAll('.tick line').clone()
      .attr('x2', width - margin * 2)
      .attr('stroke-opacity', 0.1));

  Object.entries(graph.lines).forEach(([id, line]) => {
    svg.append('path')
      .datum(line)
      .attr('fill', 'none')
      .attr('stroke', chart.color(id))
      .attr('stroke-width', 1.5)
      .attr('transform', `translate(${margin},0)`)
      .attr('d', draw);

    line.forEach((point) => {
      svg.append('circle')
        .attr('cx', x(chart.x(point.x)) + margin)
        .attr('cy', y(chart.y(point.y)))
        .attr('r', 4)
        .style('opacity', 0)
        .attr('fill', chart.color(id))
        .on('mouseover', (event) => {

          tooltipPosition.value = smartPosition(tooltipRef, event.x, event.y);

          tooltipContent.value = HoverTemplate;
          tooltipProps.value = {
            tooltipConfig: {
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