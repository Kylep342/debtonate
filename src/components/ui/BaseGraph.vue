<script setup>
import * as d3 from 'd3';
import {
  onMounted, shallowReactive, watch, ref, h,
} from 'vue';

const props = defineProps([
  'graph',
  'anchorId'
]);

const chart = shallowReactive({});
const tooltipContent = ref(null); // Dynamic tooltip content
const tooltipPosition = ref({ left: 0, top: 0 });

const initializeChart = () => {
  const graph = chart.graphs[props.anchorId];
  if (!graph.config || !graph.lines || graph.lines.length === 0) {
    return;
  }

  const width = 800;
  const height = 500;
  const margin = 50;
  const svg = d3.select('#chart' + chart.id).attr('width', width).attr('height', height);

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

    line.forEach((point, pointIndex) => {
      svg.append('circle')
        .attr('cx', x(chart.x(point.x)) + margin)
        .attr('cy', y(chart.y(point.y)))
        .attr('r', 4)
        .style('opacity', 0)
        .attr('fill', chart.color(id))
        .on('mouseover', (event) => {
          const tooltipWidth = 200; // Approximate width of the tooltip
          const tooltipHeight = 100; // Approximate height of the tooltip
          const pageWidth = window.innerWidth;
          const pageHeight = window.innerHeight;

          let left = event.pageX + 10;
          let top = event.pageY - 10;

          // Check if the tooltip exceeds the viewport width
          if (event.pageX + tooltipWidth > pageWidth) {
            left = event.pageX - tooltipWidth - 10;
          }

          // Check if the tooltip exceeds the viewport height
          if (event.pageY + tooltipHeight > pageHeight) {
            top = event.pageY - tooltipHeight - 10;
          }

          tooltipPosition.value = { left, top };

          tooltipContent.value = h(
            'table',
            { class: 'tooltip-table' },
            [
              h('thead', [
                h('tr', [
                  h('th', 'Color'),
                  h('th', chart.xLabel.value),
                  h('th', chart.x(point.x, true)),
                ]),
              ]),
              h('tbody', Object.keys(graph.lines).map((i) => {
                return h('tr', { key: i }, [
                  h('td', [
                    h('svg', { width: 10, height: 10 }, [
                      h('circle', {
                        cx: 5,
                        cy: 5,
                        r: 5,
                        fill: chart.color(i),
                      }),
                    ]),
                  ]),
                  h('td', chart.lineName(i)),
                  h('td', chart.yFormat(graph.lines[i][Math.min(pointIndex, graph.lines[i].length - 1)].y)),
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
    <h2 class="text-center">
      {{ chart.header(props.anchorId) }}
    </h2>
    <h2 class="text-center">
      {{ chart.subheader(props.anchorId) }}
    </h2>
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
