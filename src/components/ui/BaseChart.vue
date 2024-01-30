<!-- <script>
import Plotly from 'plotly.js-dist/plotly';

export default {
  props: ['chart'],
  mounted() {
    Plotly.newPlot(
      this.$refs[this.chart.id],
      this.chart.data,
      this.chart.layout,
    );
  },
  watch: {
    chart: {
      handler() {
        Plotly.react(
          this.$refs[this.chart.id],
          this.chart.data,
          this.chart.layout,
        );
      },
      deep: true,
    },
  },
};
</script>

<template>
  <div :class="['chartWrapper']">
    <div :id='chart.id' :ref='chart.id'></div>
  </div>
</template> -->
<script setup>
import Plotly from 'plotly.js-dist/plotly';
import { ref, onMounted, watch } from 'vue';

const props = defineProps(['chart']);

const chartRef = ref(null);

const initializeChart = () => {
  if (chartRef.value) {
    Plotly.newPlot(
      chartRef.value,
      props.chart.data,
      props.chart.layout,
    );
  }
};

onMounted(() => {
  initializeChart();
});

watch(
  () => props.chart,
  () => {
    if (chartRef.value) {
      Plotly.react(
        chartRef.value,
        props.chart.data,
        props.chart.layout,
      );
    }
  },
  { deep: true },
);
</script>

<template>
  <div :class="['chartWrapper']">
    <div :id='props.chart.id' ref="chartRef"></div>
  </div>
</template>
