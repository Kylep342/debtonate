<script setup>
import * as d3 from 'd3';
import {
  inject, onMounted, ref, shallowReactive, watch,
} from 'vue';
import constants from '../../constants/constants';

const props = defineProps(['chartConfig', 'header']);

const formatters = inject('formatters');
const options = inject('options');

const chart = shallowReactive({});
const periodsAsDates = ref(options.periodsAsDates);

const initializeChart = () => {
  // Guard: Ensure `chartConfig` and required properties are defined
  if (!chart.config || !chart.lines || chart.lines.length === 0) {
    return;
  }

  const width = 800;
  const height = 500;
  const margin = 50;
  const svg = d3.select(`#chart${chart.label}`).attr('width', width).attr('height', height);

  svg.selectAll('*').remove();

  const x = (periodsAsDates.value ? d3.scaleTime : d3.scaleLinear)()
    .domain([formatters.formatPeriod(0), formatters.formatPeriod(chart.config.maxX)])
    .range([0, width - margin * 2]);

  const y = d3.scaleLinear()
    .domain([0, chart.config.maxY])
    .range([height - margin, 0]);

  const draw = d3.line()
    .x((point) => x(formatters.formatPeriod(point.x)))
    .y((point) => y(point.y));

  svg.append('g')
    .attr('transform', `translate(${margin},${height - margin})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

  svg.append('g')
    .attr('transform', `translate(${margin},0)`)
    .call(d3.axisLeft(y).ticks(height / 40))
    .call((g) => g.select('.domain').remove())
    .call((g) => g.selectAll('.tick line').clone()
      .attr('x2', width - margin * 2)
      .attr('stroke-opacity', 0.1))
    .call((g) => g.append('text')
      .attr('x', -margin)
      .attr('y', 10)
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'start')
      .text('Principal Remaining ($)'));

  chart.lines.forEach((line, index) => {
    svg.append('path')
      .datum(line)
      .attr('fill', 'none')
      .attr('stroke', constants.COLORS[index % constants.COLORS.length])
      .attr('stroke-width', 1.5)
      .attr('d', draw);
  });
};

// Initialize chart after component is mounted
onMounted(() => {
  if (props.chartConfig) {
    Object.assign(chart, props.chartConfig);
    initializeChart();
  }
});

// Watch for changes in chartConfig and re-initialize the chart
watch(
  () => props.chartConfig,
  (value) => {
    if (value) {
      Object.assign(chart, value);
      initializeChart();
    }
  },
  { immediate: true }, // Initialize immediately if chartConfig is already defined
);
</script>

<template>
  <div :class="['chartWrapper']">
    <h2 :class="['text-center']">{{ chart.config.header }}</h2>
    <svg :id="'chart' + chart.label"></svg>
  </div>
</template>
