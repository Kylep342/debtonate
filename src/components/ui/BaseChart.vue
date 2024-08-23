<script setup>
import * as d3 from 'd3';
import {
  computed, inject, onMounted, reactive, watch,
} from 'vue';
import constants from '../../constants/constants';

const props = defineProps(['chartConfig']);
const formatters = inject('formatters');
const options = inject('options');

const xScale = computed(() => (options.periodsAsDates ? d3.scaleTime : d3.scaleLinear));

const chartConfig = reactive(props.chartConfig);

const initializeChart = () => {
  if (chartConfig) {
    const width = 800;
    const height = 500;
    const margin = 50;
    const svg = d3.select(`#chart${chartConfig.label}`).attr('width', width).attr('height', height);

    // clear existing elements
    svg.selectAll('*').remove();

    const x = xScale.value(
      [
        formatters.renderPeriod(0),
        formatters.renderPeriod(chartConfig.config.maxX),
      ],
      [0, width - margin - margin],
    );
    const y = d3
      .scaleLinear(
        [0, chartConfig.config.maxY],
        [height - margin, 0],
      );

    const draw = d3.line()
      .x((point) => x(formatters.renderPeriod(point.x)))
      .y((point) => y(point.y));

    svg.append('g')
      .attr('transform', `translate(${margin},${height - margin})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    svg.append('g')
      .attr('transform', `translate(${margin},0)`)
      .call(d3.axisLeft(y).ticks(height / 40))
      .call((g) => g.select('.domain').remove())
      .call((g) => g.selectAll('.tick line').clone()
        .attr('x2', width - margin - margin)
        .attr('stroke-opacity', 0.1))
      .call((g) => g.append('text')
        .attr('x', -margin)
        .attr('y', 10)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'start')
        .text('Principal Remaining ($)'));

    chartConfig.lines.forEach((line, index) => {
      svg.append('path')
        .datum(line)
        .attr('fill', 'none')
        .attr('stroke', constants.COLORS[index % constants.COLORS.length])
        .attr('stroke-width', 1.5)
        .attr('d', draw);
    });
  }
};

onMounted(() => {
  initializeChart();
});

watch(() => props.chartConfig, (newConfig) => {
  Object.assign(chartConfig, newConfig);
  initializeChart();
});
</script>

<template>
  <div :class="['chartWrapper']">
    <h2>{{ chartConfig.config.header }}</h2>
    <svg :id="'chart' + chartConfig.label"></svg>
  </div>
</template>
