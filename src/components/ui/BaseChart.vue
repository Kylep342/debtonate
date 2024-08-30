<script setup>
import * as d3 from 'd3';
import {
  inject, onMounted, reactive, watch,
} from 'vue';
import constants from '../../constants/constants';

const props = defineProps(['chartConfig']);
const formatters = inject('formatters');
const options = inject('options');

const chart = reactive(props.chartConfig);

const initializeChart = () => {
  if (chart) {
    const width = 800;
    const height = 500;
    const margin = 50;
    const svg = d3.select(`#chart${chart.label}`).attr('width', width).attr('height', height);

    // clear existing elements
    svg.selectAll('*').remove();

    const x = (options.periodsAsDates ? d3.scaleTime : d3.scaleLinear)().domain(
      [
        formatters.renderPeriod(0),
        formatters.renderPeriod(chart.config.maxX),
      ],
    ).range(
      [0, width - margin - margin],
    );
    const y = d3
      .scaleLinear().domain(
        [0, chart.config.maxY],
      ).range(
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

    chart.lines.forEach((line, index) => {
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

watch(
  () => props.chartConfig,
  (newConfig) => {
    Object.assign(chart, newConfig);
    initializeChart();
  },
);
</script>

<template>
  <div :class="['chartWrapper']">
    <h2>{{ chart.config.header }}</h2>
    <svg :id="'chart' + chartConfig.label"></svg>
  </div>
</template>
