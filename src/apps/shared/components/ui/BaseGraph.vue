<script setup lang="ts">
import * as d3 from 'd3';
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  shallowReactive,
  watch,
  Ref,
} from 'vue';

import HoverTemplate from '@/apps/shared/components/HoverTemplate.vue';
import { smartTransform, useBreakpoint } from '@/apps/shared/functions/viewport';
import { GraphConfig, Point, TooltipConfig, TooltipPosition, TooltipSize } from '@/apps/shared/types/graph';

const props = defineProps<{
  graph: GraphConfig<any>;
  anchorId: string;
}>();

const chart = shallowReactive<Record<string, any>>({});
const tooltipPosition: Ref<TooltipPosition> = ref({ left: 0, top: 0 });
const tooltipTransform: Ref<string> = ref('translateX(0%) translateY(0%)');
const tooltipSize: Ref<TooltipSize> = ref({ width: 0, height: 0 });
const activePeriod: Ref<number> = ref(1);
const isHovering: Ref<boolean> = ref(false);
const isPinned: Ref<boolean> = ref(false);

const containerRef = ref<HTMLDivElement | null>(null);
const containerWidth = ref(0);
let resizeObserver: ResizeObserver | null = null;

const { isMobile } = useBreakpoint();

const updateTooltipSize = (size: TooltipSize) => {
  tooltipSize.value = size;
};

watch([tooltipSize, tooltipPosition], ([newSize, newPos]) => {
  tooltipTransform.value = smartTransform(
    newSize,
    newPos.left,
    newPos.top,
    15
  );
}, { deep: true });

const activeTooltipConfig = computed<TooltipConfig | null>(() => {
  const g = chart.graphs?.[props.anchorId];
  if (!g) return null;
  return {
    xLabel: typeof chart.xLabel === 'function' ? chart.xLabel() : 'Period',
    xFormat: (chart.xFormat as any) || ((x: any) => `${x}`),
    minX: g.config?.minX ?? 1,
    lines: g.lines || {},
    color: (chart.color as any) || (() => '#ffffff'),
    lineName: (chart.lineName as any) || ((id: string) => id),
    yFormat: (chart.yFormat as any) || ((y: any) => `${y}`),
  };
});

const initializeChart = () => {
  if (!containerWidth.value) return;

  const graph = chart.graphs?.[props.anchorId];
  if (!graph) return;

  const totalWidth = Math.max(containerWidth.value, 800);
  const totalHeight = isMobile.value ? 300 : 500;

  const margin = { top: 20, right: 50, bottom: 40, left: 70 };

  const svg = d3.select(`#graph-${props.anchorId}`).attr('width', totalWidth).attr('height', totalHeight);
  svg.selectAll('*').remove();

  // Create temporary Y scale to measure label width
  const tempY = chart.yScale()
    .domain([chart.y(graph.config.minY || 0), chart.y(graph.config.maxY * 1.1)])
    .range([totalHeight - margin.top - margin.bottom, 0]);

  const tempAxis = svg.append('g')
    .attr('class', 'temp-axis')
    .style('opacity', '0')
    .call(d3.axisLeft(tempY).tickFormat(chart.yFormat as any));

  let maxLabelWidth = 0;
  tempAxis.selectAll('text').each(function() {
    const bbox = (this as SVGTextElement).getBBox();
    if (bbox.width > maxLabelWidth) maxLabelWidth = bbox.width;
  });

  tempAxis.remove();
  margin.left = Math.ceil(maxLabelWidth + 20);

  const innerWidth = totalWidth - margin.left - margin.right;
  const innerHeight = totalHeight - margin.top - margin.bottom;

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  const x = chart.xScale()
    .domain([chart.x(graph.config.minX || 0), chart.x(graph.config.maxX)])
    .range([0, innerWidth]);

  const y = chart.yScale()
    .domain([chart.y(0), chart.y(graph.config.maxY * 1.1)])
    .range([innerHeight, 0]);

  const draw: any = d3.line<Point>()
    .x((point: Point) => x(chart.x(point.x)))
    .y((point: Point) => y(chart.y(point.y)));

  // X Axis
  g.append('g')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x).ticks(innerWidth / 80).tickSizeOuter(0).tickFormat(chart.xFormat as any));

  // Y Axis & horizontal grid lines
  g.append('g')
    .call(d3.axisLeft(y).ticks(innerHeight / 40).tickFormat(chart.yFormat as any))
    .call((axis) => axis.select('.domain').remove())
    .call((axis) => axis.selectAll('.tick line').clone()
      .attr('x2', innerWidth)
      .attr('stroke-opacity', 0.1));

  // Line paths
  Object.entries(graph.lines).forEach(([id, line]: [string, any]) => {
    g.append('path')
      .datum(line)
      .attr('fill', 'none')
      .attr('stroke', chart.color(id))
      .attr('stroke-width', 2)
      .attr('d', draw);
  });

  // Collect all unique period values
  const allPeriodsSet = new Set<number>();
  Object.values(graph.lines).forEach((line: any) => {
    line.forEach((p: Point) => allPeriodsSet.add(p.x));
  });
  const allPeriods = Array.from(allPeriodsSet).sort((a, b) => a - b);
  if (allPeriods.length > 0 && (!activePeriod.value || !allPeriods.includes(activePeriod.value))) {
    activePeriod.value = allPeriods[0];
  }

  // Crosshair vertical line
  const focusLine = g.append('line')
    .attr('class', 'focus-line')
    .attr('y1', 0)
    .attr('y2', innerHeight)
    .attr('stroke', 'currentColor')
    .attr('stroke-opacity', 0.3)
    .attr('stroke-width', 1.5)
    .attr('stroke-dasharray', '3,3')
    .style('display', 'none')
    .style('pointer-events', 'none');

  // Focus dots per line
  const focusDots: Record<string, any> = {};
  Object.keys(graph.lines).forEach((id) => {
    focusDots[id] = g.append('circle')
      .attr('r', 4.5)
      .attr('fill', chart.color(id))
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.5)
      .style('display', 'none')
      .style('pointer-events', 'none');
  });

  const getClosestPeriod = (mouseX: number): number => {
    if (allPeriods.length === 0) return 1;
    let closest = allPeriods[0];
    let minDiff = Infinity;
    for (const p of allPeriods) {
      const px = x(chart.x(p));
      const diff = Math.abs(px - mouseX);
      if (diff < minDiff) {
        minDiff = diff;
        closest = p;
      } else {
        break;
      }
    }
    return closest;
  };

  const updateFocus = (period: number) => {
    activePeriod.value = period;
    const px = x(chart.x(period));
    focusLine
      .attr('x1', px)
      .attr('x2', px)
      .style('display', null);

    Object.entries(graph.lines).forEach(([id, line]: [string, any]) => {
      const pt = line.find((p: Point) => p.x === period);
      if (pt) {
        focusDots[id]
          .attr('cx', px)
          .attr('cy', y(chart.y(pt.y)))
          .style('display', null);
      } else {
        focusDots[id].style('display', 'none');
      }
    });
  };

  if (isPinned.value) {
    updateFocus(activePeriod.value);
  }

  // Full-chart interactive overlay rect
  const overlay = g.append('rect')
    .attr('class', 'chart-overlay')
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .attr('fill', 'transparent')
    .style('cursor', 'crosshair')
    .style('pointer-events', 'all');

  overlay
    .on('pointerenter', () => {
      isHovering.value = true;
    })
    .on('pointermove', (event: PointerEvent) => {
      if (isPinned.value) return;
      const [mouseX] = d3.pointer(event, g.node());
      const period = getClosestPeriod(mouseX);
      updateFocus(period);

      tooltipPosition.value = {
        left: event.clientX,
        top: event.clientY,
      };
      isHovering.value = true;
    })
    .on('pointerleave', () => {
      if (!isPinned.value) {
        isHovering.value = false;
        focusLine.style('display', 'none');
        Object.values(focusDots).forEach(d => d.style('display', 'none'));
      }
    })
    .on('click', (event: PointerEvent) => {
      const [mouseX] = d3.pointer(event, g.node());
      const period = getClosestPeriod(mouseX);
      updateFocus(period);
      isPinned.value = !isPinned.value;
      if (isPinned.value) {
        tooltipPosition.value = {
          left: event.clientX,
          top: event.clientY,
        };
      }
    });
};

onMounted(() => {
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
  }
});

onUnmounted(() => {
  if (resizeObserver && containerRef.value) {
    resizeObserver.unobserve(containerRef.value);
  }
});

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
  <div
    ref="containerRef"
    class="chartWrapper relative"
  >
    <div class="mb-3 text-center">
      <h2
        v-if="chart.header"
        class="font-bold text-base sm:text-lg text-base-content tracking-tight"
      >
        {{ chart.header(anchorId) }}
      </h2>
      <h3
        v-if="chart.subheader"
        class="text-xs text-base-content/60 font-mono mt-0.5"
      >
        {{ chart.subheader(anchorId) }}
      </h3>
    </div>

    <!-- SVG Graph Container -->
    <div class="overflow-x-auto w-full">
      <svg
        :id="`graph-${anchorId}`"
        class="block mx-auto"
      />
    </div>

    <!-- Floating Hover Tooltip (Active when hovering or pinned) -->
    <div
      v-if="activeTooltipConfig && (isHovering || isPinned)"
      id="tooltip"
      :style="{
        left: (tooltipPosition.left + 15) + 'px',
        top: (tooltipPosition.top + 15) + 'px',
        transform: tooltipTransform,
      }"
    >
      <div class="relative">
        <span
          v-if="isPinned"
          class="badge badge-xs badge-secondary absolute -top-2 -right-2 uppercase font-bold tracking-wider shadow-md"
        >
          Pinned
        </span>
        <HoverTemplate
          :tooltip-config="activeTooltipConfig"
          :index="activePeriod"
          :update-tooltip-size="updateTooltipSize"
        />
      </div>
    </div>
  </div>
</template>

<style>
#tooltip {
  pointer-events: none;
  position: fixed;
  z-index: 50;
  transition: transform 0.05s ease-out, opacity 0.1s ease-out;
}
.chartWrapper {
  width: 100%;
}
</style>
