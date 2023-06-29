<script>
import Plotly from 'plotly.js-dist/plotly';

export default {
  props: ['chart'],
  mounted() {
    Plotly.newPlot(this.$refs[this.chart.id], this.chart.data, this.chart.layout);
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
</template>
