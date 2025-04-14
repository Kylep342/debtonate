<script setup lang="ts">
import * as d3 from 'd3';
import {
  onMounted, ref, shallowReactive, shallowRef, watch,
} from 'vue';

import HoverTemplate from '@/apps/shared/components/HoverTemplate.vue';
import { smartPosition } from '@/apps/shared/functions/viewport';
import { Arc, GraphConfig, TooltipConfig } from '@/apps/shared/types/graph';

const props = defineProps<{
  config: any,
  graph: Arc[],
  anchorId: string,
}>();

const elId = `donut-graph-${props.anchorId}`;
const tooltipId = `${elId}-tooltip`;

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
  const width = 300;
  const height = 300;
  const margin = 40;
  const radius = Math.min(width, height) / 2 - margin;

  const svg = d3.select(`#${elId}`)
    .html("")
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const color = d3.scaleOrdinal()
    .domain(props.graph.map(d => d.label))
    .range(d3.schemeCategory10);

  const pie = d3.pie<Arc>()
    .sort(null)
    .value(d => d.value);

  const arc = d3.arc<d3.PieArcDatum<Arc>>()
    .innerRadius(radius * 0.5)
    .outerRadius(radius);

  svg.selectAll("path")
    .data(pie(props.graph))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", d => d.data.color || color(d.data.label))
    // .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.8)
    // .on("mouseover", (event, d) => {
    //   tooltipPosition.value = smartPosition(tooltipRef, event.x, event.y);
    //   tooltipContent.value = HoverTemplate;
    //   tooltipProps.value = {
    //     tooltipConfig: {
    //       xLabel: props.config.xLabel(),
    //       xFormat: props.config.xFormat,
    //       yFormat: props.config.yFormat,
    //       lines: { [d.data.label]: [{ x: 0, y: d.data.value }] },
    //       color: () => d.data.color || color(d.data.label),
    //       lineName: () => d.data.label,
    //     },
    //     index: 1,
    //     updateTooltipSize,
    //   };
    // })
    // .on("mouseout", () => {
    //   tooltipContent.value = null;
    // });
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
  <div>
    <!-- <h1>{{ config.header() }}</h1> -->
    <svg :id="elId" width="300" height="300"></svg>
    <div :id="tooltipId" ref="tooltipRef" :style="{
      left: tooltipPosition.left + 'px',
      top: tooltipPosition.top + 'px',
      opacity: tooltipContent ? 1 : 0
    }">
      <component :is="tooltipContent" v-bind="tooltipProps" />
    </div>
  </div>
</template>

<style>
{
  pointer-events: none;
  position: absolute;
  transition: transform 0.1s ease;
}
</style>