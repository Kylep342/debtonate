<script setup>
import Plotly from 'plotly.js-dist/plotly';
import { ref, onMounted, watchEffect } from 'vue';

const props = defineProps(['chart']);

const chartRef = ref(null);

const initializeChart = () => {
  if (props.chart && chartRef.value) {
    Plotly.newPlot(chartRef.value, props.chart.data, props.chart.layout);
  }
};

onMounted(() => {
  initializeChart();
});

watchEffect(
  () => {
    if (props.chart && chartRef.value) {
      Plotly.react(chartRef.value, props.chart.data, props.chart.layout);
    }
  },
);
</script>

<template>
  <div :class="['chartWrapper']">
    <div :id="props.chart?.id" ref="chartRef"></div>
  </div>
</template>
