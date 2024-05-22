<script setup>
import Plotly from 'plotly.js-dist/plotly';
import { ref, onMounted, watch } from 'vue';

const props = defineProps(['chart']);

const chartRef = ref(null);

const initializeChart = () => {
  if (props.chart) {
    Plotly.newPlot(chartRef.value, props.chart.data, props.chart.layout);
  }
};

onMounted(() => {
  initializeChart();
});

watch(
  () => props.chart,
  () => {
    if (props.chart) {
      Plotly.react(chartRef.value, props.chart.data, props.chart.layout);
    }
  },
  { deep: true },
);
</script>

<template>
  <div :class="['chartWrapper']">
    <div :id="props.chart?.id" ref="chartRef"></div>
  </div>
</template>
