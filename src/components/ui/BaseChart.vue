<script setup>
import * as d3 from 'd3';
import {
  onMounted, shallowReactive, watch,
} from 'vue';
import constants from '../../constants/constants';
import useCoreStore from '../../stores/core';

const props = defineProps(['chartConfig', 'header']);

const state = useCoreStore();
const chart = shallowReactive({});

const initializeChart = () => {
  if (!chart.config || !chart.lines || chart.lines.length === 0) {
    return;
  }

  const width = 800;
  const height = 500;
  const margin = 50;
  const svg = d3.select(`#chart${chart.label}`).attr('width', width).attr('height', height);

  svg.selectAll('*').remove();

  const x = (state.periodsAsDates ? d3.scaleTime : d3.scaleLinear)()
    .domain([state.formatPeriod(0), state.formatPeriod(chart.config.maxX)])
    .range([0, width - margin * 2]);

  const y = d3.scaleLinear()
    .domain([0, chart.config.maxY])
    .range([height - margin, 0]);

  const draw = d3.line()
    .x((point) => x(state.formatPeriod(point.x)))
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
      .text(`Principal Remaining (${state.currencySymbol})`));

  chart.lines.forEach((line, index) => {
    svg.append('path')
      .datum(line)
      .attr('fill', 'none')
      .attr('stroke', constants.COLORS[index % constants.COLORS.length])
      .attr('stroke-width', 1.5)
      .attr('d', draw);

    line.forEach(point => {
      svg.append('circle')
        .attr('cx', x(state.formatPeriod(point.x)))
        .attr('cy', y(point.y))
        .attr('r', 4)
        .style('opacity', 0)
        .attr('fill', constants.COLORS[index % constants.COLORS.length])
        .on('mouseover', (event) => {
          d3.select('#tooltip')
            .style('opacity', 1)
            .style('left', `${event.pageX + 5}px`)
            .style('top', `${event.pageY - 28}px`)
            .html(`${state.formatPeriod(point.x, true)}<br>${state.Money(point.y)}`);
        })
        .on('mouseout', () => {
          d3.select('#tooltip').style('opacity', 0);
        });
    });
  });
};

onMounted(() => {
  if (props.chartConfig) {
    Object.assign(chart, props.chartConfig);
    initializeChart();
  }
});

watch(
  () => props.chartConfig,
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
  <div :class="['chartWrapper']">
    <h2 :class="['text-center']">
      {{ chart.config.header }}
    </h2>
    <h2 :class="['text-center']">
      {{ chart.config.subheader }}
    </h2>
    <svg :id="'chart' + chart.label" />
    <div id="tooltip" style="position: absolute; opacity: 0; background: #fff; border: 1px solid #ccc; padding: 5px; pointer-events: none;"></div>
  </div>
</template>

<style>
#tooltip {
  position: absolute;
  opacity: 0;
  background: white;
  border: 1px solid gray;
  padding: 5px;
  border-radius: 3px;
  pointer-events: none;
  transition: opacity 0.3s;
}
</style>
