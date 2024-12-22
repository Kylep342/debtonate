<script setup>
import * as d3 from 'd3';
import {
  onMounted, shallowReactive, watch, ref, h,
} from 'vue';
import constants from '../../constants/constants';

const props = defineProps([
  'graph',
  'x',
  'xScale',
  'y',
  'yFormat',
  'yLabel',
  'yScale',
  'lineLabel',
  'lineName',
]);

const chart = shallowReactive({});
const tooltipContent = ref(null); // Dynamic tooltip content
const tooltipPosition = ref({ left: 0, top: 0 });

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
      .attr('stroke-opacity', 0.1));

  Object.entries(chart.lines).forEach(([id, line], index) => {
    console.log(id)
    console.log(line)
    svg.append('path')
      .datum(line)
      .attr('fill', 'none')
      .attr('stroke', constants.COLORS[index % constants.COLORS.length])
      .attr('stroke-width', 1.5)
      .attr('transform', `translate(${margin},0)`)
      .attr('d', draw);

    line.forEach((point, pointIndex) => {
      svg.append('circle')
        .attr('cx', x(props.x(point.x)) + margin)
        .attr('cy', y(props.y(point.y)))
        .attr('r', 4)
        .style('opacity', 0)
        .attr('fill', constants.COLORS[index % constants.COLORS.length])
        .on('mouseover', (event) => {
          tooltipPosition.value = { left: event.pageX + 10, top: event.pageY - 10 };

          tooltipContent.value = h(
            'table',
            { class: 'tooltip-table' },
            [
              h('thead', [
                h('tr', [
                  h('th', 'Color'),
                  h('th', `${props.lineLabel}`),
                  h('th', props.yLabel),
                ]),
              ]),
              h('tbody', Object.keys(chart.lines).map((i) => {
                return h('tr', { key: i }, [
                  h('td', [
                    h('svg', { width: 10, height: 10 }, [
                      h('circle', {
                        cx: 5,
                        cy: 5,
                        r: 5,
                        fill: constants.COLORS[i % constants.COLORS.length],
                      }),
                    ]),
                  ]),
                  h('td', props.lineName(i)),
                  h('td', props.yFormat(chart.lines[i][pointIndex].y)),
                ]);
              })),
            ],
          );

          d3.select('#tooltip').style('opacity', 1);
        })
        .on('mouseout', () => {
          d3.select('#tooltip').style('opacity', 0);
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
    <h2 class="text-center">{{ chart.config.header }}</h2>
    <h2 class="text-center">{{ chart.config.subheader }}</h2>
    <svg :id="'chart' + chart.id" />
    <div
      id="tooltip"
      :style="{ left: tooltipPosition.left + 'px', top: tooltipPosition.top + 'px', position: 'absolute', opacity: tooltipContent ? 1 : 0 }"
    >
      <component :is="tooltipContent" />
    </div>
  </div>
</template>

<style scoped>
.tooltip-table {
  border-collapse: collapse;
  width: 100%;
  background: white;
  border: 1px solid #ccc;
  padding: 5px;
}

.tooltip-table th,
.tooltip-table td {
  border: 1px solid #ccc;
  padding: 5px;
  text-align: left;
}
</style>
