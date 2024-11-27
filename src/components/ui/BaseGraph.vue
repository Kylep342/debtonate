<script setup>
import * as d3 from 'd3';
import {
  onMounted, onUpdated, shallowReactive, watch,
} from 'vue';
import constants from '../../constants/constants';

const props = defineProps([
  'graph',
  'x',
  'xScale',
  'y',
  'yScale',
  'hoverFormat',
]);

const chart = shallowReactive({});

const initializeChart = () => {
  if (!chart.config || !chart.lines || chart.lines.length === 0) {
    return;
  }

  const width = 800;
  const height = 500;
  const margin = 50;
  const svg = d3.select(`#chart${props.id}`).attr('width', width).attr('height', height);

  svg.selectAll('*').remove();

  const x = props.xScale()
    .domain([props.x(0), props.x(chart.config.maxX)])
    .range([0, width - margin * 2]);

  const y = props.yScale()
    .domain([props.y(0), props.y(chart.config.maxY * 1.1)])
    .range([height - margin, 0]);

  const draw = d3.line()
    .x((point) => x(props.x(point.x)))
    .y((point) => y(props.y(point.y)));

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

  chart.lines.forEach((line, index) => {
    svg.append('path')
      .datum(line)
      .attr('fill', 'none')
      .attr('stroke', constants.COLORS[index % constants.COLORS.length])
      .attr('stroke-width', 1.5)
      .attr('transform', `translate(${margin},0)`)
      .attr('d', draw);

    line.forEach(point => {
      svg.append('circle')
        .attr('cx', x(props.x(point.x)) + margin)
        .attr('cy', y(props.y(point.y)))
        .attr('r', 4)
        .style('opacity', 0)
        .attr('fill', constants.COLORS[index % constants.COLORS.length])
        .on('mouseover', (event) => {
          d3.select('#tooltip')
            .style('opacity', 1)
            .style('left', `${event.pageX + 5}px`)
            .style('top', `${event.pageY - 28}px`)
            .html(props.hoverFormat(point));
        })
        .on('mouseout', () => {
          d3.select('#tooltip').style('opacity', 0);
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
  <div :class="['chartWrapper']">
    <h2 :class="['text-center']">
      {{ chart.config.header }}
    </h2>
    <h2 :class="['text-center']">
      {{ chart.config.subheader }}
    </h2>
    <svg :id="'chart' + chart.id" />
    <div
      id="tooltip"
      style="position: absolute; opacity: 0; background: oklch(100% 3.5594404384177905e-8 106.37411429114086); border: 1px solid oklch(84.52% 0 0); padding: 5px; pointer-events: none;"
    />
  </div>
</template>
