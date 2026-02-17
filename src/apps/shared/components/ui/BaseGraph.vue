<script setup lang="ts">
import * as d3 from 'd3';
import {
  onMounted,
  onUnmounted,
  ref,
  shallowReactive,
  shallowRef,
  watch,
  Ref,
  ShallowReactive,
  ShallowRef,
} from 'vue';

import HoverTemplate from '@/apps/shared/components/HoverTemplate.vue';
import { smartTransform } from '@/apps/shared/functions/viewport';
import { GraphConfig, Point, TooltipConfig, TooltipPosition, TooltipSize } from '@/apps/shared/types/graph';

type TooltipProps = {
  tooltipConfig: TooltipConfig,
  index: number,
  updateTooltipSize: (size: TooltipSize) => void,
}

const props = defineProps<{
  graph: GraphConfig,
  anchorId: string
}>();

const chart: ShallowReactive<GraphConfig> = shallowReactive({});
const tooltipContent: ShallowRef<typeof HoverTemplate|null> = shallowRef(null);
const tooltipPosition: Ref<TooltipPosition> = ref({ left: 0, top: 0 });
const tooltipTransform: Ref<string> = ref('translateX(0%) translateY(0%)');
const tooltipProps: Ref<TooltipProps|null> = ref(null);
const tooltipSize: Ref<TooltipSize> = ref({ width: 0, height: 0 });

const containerRef = ref<HTMLDivElement | null>(null);
const containerWidth = ref(0);
let resizeObserver: ResizeObserver | null = null;

const updateTooltipSize = (size: TooltipSize) => {
  tooltipSize.value = size;
};

// This watcher sets the CSS transform to move the HoverTemplate
watch(tooltipSize, (newSize) => {
  if (tooltipContent.value) {
    tooltipTransform.value = smartTransform(
      newSize,
      tooltipPosition.value.left,
      tooltipPosition.value.top
    );
  }
}, { deep: true });


const initializeChart = () => {
  if (!containerWidth.value) return;

  const graph = chart.graphs[props.anchorId];

  const totalWidth = containerWidth.value;
  const totalHeight = 500;

  const margin = { top: 20, right: 50, bottom: 40, left: 70 };

  const svg = d3.select(`#graph-${props.anchorId}`).attr('width', totalWidth).attr('height', totalHeight);
  svg.selectAll('*').remove();

  // create a temporary Y scale to measure label width
  const tempY = chart.yScale()
    .domain([chart.y(0), chart.y(graph.config.maxY * 1.1)])
    .range([totalHeight - margin.top - margin.bottom, 0]);

  const tempAxis = svg.append('g')
    .attr('class', 'temp-axis')
    .style('opacity', '0')
    .call(d3.axisLeft(tempY).tickFormat(chart.yFormat));

  // measure the widest tick label to adjust margin.left dynamically
  let maxLabelWidth = 0;
  tempAxis.selectAll('text').each(function() {
    const bbox = (this as SVGTextElement).getBBox();
    if (bbox.width > maxLabelWidth) maxLabelWidth = bbox.width;
  });

  // Clean up temp axis && update left margin based on max width + padding
  tempAxis.remove();
  margin.left = Math.ceil(maxLabelWidth + 20);

  const innerWidth = totalWidth - margin.left - margin.right;
  const innerHeight = totalHeight - margin.top - margin.bottom;

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const x = chart.xScale()
    .domain([chart.x(0), chart.x(graph.config.maxX)])
    .range([0, innerWidth]);

  const y = chart.yScale()
    .domain([chart.y(0), chart.y(graph.config.maxY * 1.1)])
    .range([innerHeight, 0]);

  const draw = d3.line()
    .x((point: Point) => x(chart.x(point.x)))
    .y((point: Point) => y(chart.y(point.y)));

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

    line.forEach((point: Point) => {
      g.append('circle')
        .attr('cx', x(chart.x(point.x)))
        .attr('cy', y(chart.y(point.y)))
        .attr('r', 4)
        .style('opacity', 0)
        .attr('fill', chart.color(id))
        .on('mouseover', (event) => {
          tooltipPosition.value = { left: event.x, top: event.y };

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
  // Observe container resizing to redraw graph responsively
  if (containerRef.value) {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        containerWidth.value = entry.contentRect.width;
      }
    });
    resizeObserver.observe(containerRef.value);
  }

  if (props.graph) {
    Object.assign(chart, props.graph);
    // Initial draw will happen when containerWidth is set by observer
  }
});

onUnmounted(() => {
  if (resizeObserver && containerRef.value) {
    resizeObserver.unobserve(containerRef.value);
  }
});

// Watch containerWidth to trigger redraws on resize
watch(containerWidth, () => {
  if (props.graph) initializeChart();
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
  <div class="chartWrapper" ref="containerRef">
    <h2 class="text-center">
      {{ chart.header(anchorId) }}
    </h2>
    <h2 class="text-center">
      {{ chart.subheader(anchorId) }}
    </h2>
    <svg :id="`graph-${anchorId}`" />
    <div id="tooltip" :style="{
      left: tooltipPosition.left + 'px',
      top: tooltipPosition.top + 'px',
      transform: tooltipTransform,
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
  transition: transform 0.1s ease-out, opacity 0.1s ease-out;
}
/* Ensure the wrapper takes full width so ResizeObserver works */
.chartWrapper {
  width: 100%;
  min-width: 800px;
}
</style>
