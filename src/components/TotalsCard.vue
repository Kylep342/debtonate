<script>
export default {
  props: ['principal', 'effectiveRate', 'minimumPayment'],
  computed: {
    renderedPrincipal() {
      return this.principal.toFixed(2);
    },
    renderedRate() {
      return (this.effectiveRate * 100).toFixed(2);
    },
    renderedMinPayment() {
      return this.minimumPayment.toFixed(2);
    },
  },
};
</script>

<template>
  <div>
    <div :class="['cardHeader', 'header']">
      <h2 class="cardHeaderTitle">
        Totals
      </h2>
    </div>
    <div class="cardBody">
      <table class="">
        <tr>
          <td class="textLeft">Principal</td>
          <td class="textRight"><b>${{ renderedPrincipal }}</b></td>
        </tr>
        <tr>
          <td class="textLeft">Effective Rate</td>
          <td class="textRight"><b>{{ renderedRate }}%</b></td>
        </tr>
        <tr>
          <td class="textLeft">Minimum Payment</td>
          <td class="textRight"><b>${{ renderedMinPayment }}</b></td>
        </tr>
      </table>
    </div>
    <div :class="['cardFooter', 'footer']">
      <!-- <div class="cardFooterButtonContainer">
        <button @click="this.viewLoan(this.loan.id)">View</button>
      </div> -->
    </div>
  </div>
</template>
