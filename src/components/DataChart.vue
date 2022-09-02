<script>
import Plotly from "plotly.js-dist/plotly"

export default {
  props: ["chart"],
  mounted() {
    Plotly.newPlot(this.$refs[this.chart.id], this.chart.data, this.chart.layout);
  },
  watch: {
    chart: {
      handler: function() {
        Plotly.react(
          this.$refs[this.chart.id],
          this.chart.data,
          this.chart.layout
        );
      },
      deep: true
    }
  }
}
</script>

<template>
  <div v-bind:id="chart.id" :ref="chart.id"></div>
</template>